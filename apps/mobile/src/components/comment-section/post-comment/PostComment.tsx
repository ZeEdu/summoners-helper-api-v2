import { useCallback, useEffect, useRef, useState } from "react"
import { StyleSheet, TextInputContentSizeChangeEvent, View } from "react-native"

import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'

import { zodResolver } from "@hookform/resolvers/zod"
import { createCommentFormSchema, CreateCommentFormType, ISerializedComment } from "@org/contracts"

import { useForm } from "react-hook-form"
import { Avatar, Button, Card, IconButton, Text, useTheme } from "react-native-paper"
import { useAuthContext } from "../../../contexts/auth/useAuth"
import { ApiService } from "../../../services/api/api.service"
import AppInputController from "../../forms/AppInputController"

type Props = {
  guideId: string;
  addComment: (comment: ISerializedComment) => void,
  addReply: (comment: ISerializedComment, replyTo: ISerializedComment) => void
  replyTo: ISerializedComment | null,
  setReplyTo: React.Dispatch<React.SetStateAction<ISerializedComment | null>>;
  setShowRepliesTo: React.Dispatch<React.SetStateAction<ISerializedComment | null>>
}

const resolver = zodResolver(createCommentFormSchema)

const MIN_HEIGHT = 40;
const MAX_HEIGHT = 160;

export default function PostComment({ guideId, addComment, replyTo, setReplyTo, addReply, setShowRepliesTo }: Props) {
  const authContext = useAuthContext()

  const { control, handleSubmit, setValue } = useForm<CreateCommentFormType>({
    resolver,
    defaultValues: {
      guide: guideId,
      content: ''
    }
  })

  const [height, setHeight] = useState(56)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const theme = useTheme()

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
    bottomSheetModalRef.current?.expand()
  }, []);

  const handleContentSizeChange = (
    event: TextInputContentSizeChangeEvent
  ) => {
    const contentHeight = event.nativeEvent.contentSize.height;

    const nextHeight = Math.min(
      Math.max(contentHeight, MIN_HEIGHT),
      MAX_HEIGHT,
    );

    setHeight(nextHeight);
  };

  const handleOnDismiss = () => {
    setReplyTo(null)
  }

  const onSubmit = (formValues: CreateCommentFormType) => {
    const createReply = async (replyToComment: ISerializedComment) => {
      setLoading(true)
      setError('')

      ApiService.Comments
        .reply({
          ...formValues,
          replyTo: replyToComment.id
        })
        .then((comment) => {
          comment.createdBy = authContext.user
          addReply(comment, replyToComment)

          setValue('content', '')
          setReplyTo(null)
          setShowRepliesTo(replyToComment)

          bottomSheetModalRef.current?.dismiss()
        })
        .catch(() => {
          setError('Não foi possivel criar o comentário')
        }).finally(() => {
          setLoading(false)
        })
    }

    const createPost = async () => {
      setLoading(true)
      setError('')

      ApiService.Comments
        .create(formValues)
        .then((comment) => {
          comment.createdBy = authContext.user
          if (replyTo) {
            addReply(comment, replyTo)
          } else {
            addComment(comment)
          }
          setValue('content', '')
          setReplyTo(null)

          bottomSheetModalRef.current?.dismiss()
        })
        .catch(() => {
          setError('Não foi possivel criar o comentário')
        }).finally(() => {
          setLoading(false)
        })
    }


    if (replyTo) {
      createReply(replyTo)
    } else {
      createPost()
    }

  }


  useEffect(() => {
    if (replyTo) {
      handlePresentModalPress()
    }
  }, [replyTo])


  const getCreatedBy = (replyTo: ISerializedComment) => {
    if (replyTo.createdBy && 'username' in replyTo.createdBy) {
      return replyTo.createdBy.username
    }

    return ''
  }

  return (
    <View>
      <Button
        onPress={handlePresentModalPress}
        mode="contained"
      >
        Comentar
      </Button>
      <BottomSheetModal
        backgroundStyle={{
          backgroundColor: theme.colors.surfaceVariant
        }}
        handleIndicatorStyle={{
          backgroundColor: theme.colors.onSurfaceVariant
        }}
        ref={bottomSheetModalRef}
        onDismiss={handleOnDismiss}
      >
        <BottomSheetView style={{
          flex: 1,
          display: 'flex',
          alignItems: 'stretch',
        }}>

          <View>
            {
              replyTo && (
                <Card
                  mode="contained"
                  style={[
                    styles.card,
                    {
                      backgroundColor: theme.colors.surface,
                    },
                  ]}
                >
                  <Card.Content>
                    <View style={styles.header}>
                      <Avatar.Text
                        size={40}
                        label={getCreatedBy(replyTo).slice(0, 2).toUpperCase()}
                      />

                      <View style={styles.author}>
                        <Text variant="titleSmall">{getCreatedBy(replyTo)}</Text>

                        <Text
                          variant="bodySmall"
                          style={{ color: theme.colors.onSurfaceVariant }}
                        >
                          {new Date(replyTo.createdAt).toLocaleString('pt-BR')}
                        </Text>
                      </View>
                    </View>

                    <Text
                      variant="bodyMedium"
                      style={styles.content}
                    >
                      {replyTo.content}
                    </Text>
                  </Card.Content>
                </Card>
              )
            }
            <View
              style={{
                flex: 1,
                margin: 8,
                flexDirection: 'row',
                alignItems: 'flex-end',
              }}>
              <AppInputController
                control={control}
                inputOptions={{
                  onContentSizeChange: handleContentSizeChange,
                  label: 'Comentário',
                  placeholder: 'Escreva a sua opinião',
                  multiline: true,
                  style: {
                    height,
                    flex: 1
                  }
                }}
                name={"content"}
              />
              <IconButton
                iconColor={theme.colors.primary}
                icon="send"
                onPress={handleSubmit(onSubmit)}
                disabled={loading}
              />
            </View>
          </View>

        </BottomSheetView>
      </BottomSheetModal>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    margin: 8,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  author: {
    flex: 1,
    marginLeft: 12,
  },

  content: {
    marginTop: 16,
    lineHeight: 21,
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    justifyContent: 'flex-end'
  },

  like: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});