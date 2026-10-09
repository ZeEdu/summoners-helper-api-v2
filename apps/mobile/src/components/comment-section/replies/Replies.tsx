import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";

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
        backgroundStyle={{
          backgroundColor: theme.colors.surfaceVariant
        }}
        handleIndicatorStyle={{
          backgroundColor: theme.colors.onSurfaceVariant
        }}
        ref={bottomSheetModalRef}
      >
        <BottomSheetView style={{
          flex: 1,
          display: 'flex',
          alignItems: 'stretch',
        }}>
          <View>
            <FlatList
              keyExtractor={({ id }) => id}
              data={replies}
              ListEmptyComponent={() => (
                <View style={{ margin: 16, justifyContent: 'center' }}>
                  <Text
                    variant="titleMedium"
                    style={{ textAlign: 'center', marginVertical: 8 }}
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
                  />
                )}
            />
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  )
}