import { useCallback, useEffect, useRef, useState } from "react"
import { Pressable, StyleSheet, TextInputContentSizeChangeEvent, View } from "react-native"

import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'

import { zodResolver } from "@hookform/resolvers/zod"
import { createCommentFormSchema, CreateCommentFormType, ISerializedComment } from "@org/contracts"

import { useForm } from "react-hook-form"
import { Button, Icon, MD3Theme, Text, useTheme } from "react-native-paper"
import { useAuthContext } from "../../../contexts/auth/useAuth"
import { ApiService } from "../../../services/api/api.service"
import AppInputController from "../../forms/AppInputController"
import ReplyCard from "./reply-card/ReplyCard"

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
  const theme = useTheme()
  const styles = makeStyles(theme)

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

  return (
    <View>
      <Button
        onPress={handlePresentModalPress}
        mode="contained"
      >
        Comentar
      </Button>
      <BottomSheetModal
        backgroundStyle={styles.background}
        handleIndicatorStyle={styles.handle}
        ref={bottomSheetModalRef}
        onDismiss={handleOnDismiss}
      >
        <BottomSheetView style={styles.bottomSheet}>
          <Text variant="titleLarge">
            {
              replyTo ? 'Responder' : 'Novo Comentário'
            }
          </Text>
          <View>
            {replyTo && <ReplyCard replyTo={replyTo} />}
            <View
              style={styles.form}
            >
              <AppInputController
                control={control}
                inputOptions={{
                  onContentSizeChange: handleContentSizeChange,
                  placeholder: 'Escreva a seu comentário...',
                  multiline: true,
                  style: {
                    height,
                    flex: 1
                  }
                }}
                name={"content"}
              />
              <Pressable
                onPress={handleSubmit(onSubmit)}
                disabled={loading}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 8,
                  backgroundColor: theme.colors.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: loading ? 0.5 : 1,
                }}
              >
                <Icon
                  source="send"
                  size={24}
                  color={theme.colors.onPrimary}
                />
              </Pressable>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  )
}

const makeStyles = ({ colors }: MD3Theme) => {
  return StyleSheet.create({
    background: {
      backgroundColor: colors.surfaceVariant
    },
    handle: {
      backgroundColor: colors.onSurfaceVariant
    },
    bottomSheet: {
      flex: 1,
      gap: 8,
      display: 'flex',
      alignItems: 'stretch',
      marginHorizontal: 16
    },
    form: {
      flex: 1,
      gap: 8,
      flexDirection: 'row',
      alignItems: 'center',
    }
  })
};