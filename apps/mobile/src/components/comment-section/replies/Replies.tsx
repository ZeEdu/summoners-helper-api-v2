import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Button, MD3Theme, Text, useTheme } from "react-native-paper";

import { CommentPaginationDto, ISerializedComment } from "@org/contracts";

import { ApiService } from "../../../services/api/api.service";
import Comment from "../comment/Comment";

type Props = {
  guideId: string;
  showRepliesTo: ISerializedComment | null;
  setShowRepliesTo: React.Dispatch<React.SetStateAction<ISerializedComment | null>>;
  setReplyTo: React.Dispatch<React.SetStateAction<ISerializedComment | null>>
}

export default function Replies({ showRepliesTo, setShowRepliesTo, guideId, setReplyTo }: Props) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const [replies, setReplies] = useState<ISerializedComment[]>([])

  const theme = useTheme()
  const styles = makeStyles(theme)

  const defaultQuery: CommentPaginationDto = {
    limit: 10,
    guide: guideId
  }

  useEffect(() => {
    if (!showRepliesTo) return

    async function getReplies() {
      ApiService.Comments.get({
        ...defaultQuery,
        replyTo: showRepliesTo?.id
      })
        .then(({ comments }) => {
          setReplies(comments)
          bottomSheetModalRef.current?.present();
          bottomSheetModalRef.current?.expand();
        })
        .catch()
        .finally()
    }

    getReplies()
  }, [showRepliesTo])


  const handleOnDismiss = () => {
    setShowRepliesTo(null)
  }

  const handleReplyTo = () => {
    setShowRepliesTo(null)
    setReplyTo(showRepliesTo)
  }

  return (
    <View>
      <BottomSheetModal
        onDismiss={handleOnDismiss}
        backgroundStyle={styles.background}
        handleIndicatorStyle={styles.handleIndicator}
        ref={bottomSheetModalRef}
      >
        <BottomSheetView style={styles.view}>
          <FlatList
            style={styles.flatList}
            keyExtractor={({ id }) => id}
            data={replies}
            ListEmptyComponent={() => (
              <View style={styles.emptyComponentWrapper}>
                <Text
                  variant="titleMedium"
                  style={styles.emptyComponentText}
                >
                  Esse comentário não tem nenhuma resposta
                </Text>
                <Button
                  mode="contained"
                  onPress={handleReplyTo}
                >
                  Responder
                </Button>
              </View>
            )}
            renderItem={
              ({ item: comment }) => (
                <Comment
                  comment={comment}
                  setReplyTo={setReplyTo}
                  setShowRepliesTo={setShowRepliesTo}
                  useAlternativeColors={true}
                />
              )}
          />
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
    handleIndicator: {
      backgroundColor: colors.onSurfaceVariant
    },
    view: {
      flex: 1,
      display: 'flex',
      alignItems: 'stretch',
    },
    flatList: {
      marginHorizontal: 16
    },
    emptyComponentWrapper: {
      margin: 16,
      justifyContent: 'center'
    },
    emptyComponentText: {
      textAlign: 'center',
      marginVertical: 8
    }
  })
}