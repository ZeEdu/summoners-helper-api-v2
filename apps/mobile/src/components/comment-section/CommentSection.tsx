import { FlatList, StyleSheet, View } from "react-native";

import { CommentPaginationDto, ISerializedComment } from "@org/contracts";
import { useEffect, useState } from "react";
import { Button, Text } from "react-native-paper";
import useI18n from "../../contexts/i18n/useI18n";
import { ApiService } from "../../services/api/api.service";
import Comment from "./comment/Comment";
import PostComment from "./post-comment/PostComment";
import Replies from "./replies/Replies";

type Props = {
  guideId: string;
  reportComment: (comment: ISerializedComment) => void;
}

export default function CommentSection({ guideId, reportComment }: Props) {
  const i18n = useI18n()

  const [comments, setComments] = useState<ISerializedComment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown | undefined>(undefined);

  const [replyTo, setReplyTo] = useState<ISerializedComment | null>(null)
  const [showRepliesTo, setShowRepliesTo] = useState<ISerializedComment | null>(null)

  const defaultQuery: CommentPaginationDto = {
    limit: 10,
    guide: guideId,
  }

  const [query, setQuery] = useState<CommentPaginationDto>({ ...defaultQuery })

  const loadMore = () => {
    setQuery((previous) => {
      if (!previous.offset) {
        return { ...previous, offset: 1 }
      }
      return { ...previous, offset: previous.offset + 1 }
    })
    if (query.offset) {
      query.offset = query.offset + 1
    }
  }

  const addComment = (comment: ISerializedComment) => {
    setComments((previous) => [comment, ...previous])
  }

  const addReplyTo = (comment: ISerializedComment, replyTo: ISerializedComment) => {
    if (replyTo.id === replyTo.id) {
      setComments((previous) => [comment, ...previous])
    }
  }

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    setComments([]);

    const fetchData = async () => {
      try {
        const response = await ApiService.Comments.get(query);

        setComments((previous) => {
          if (query.offset && (query.offset > 0)) {
            return previous.concat(response.comments)
          }
          return response.comments
        })
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  return (
    <View>
      <FlatList
        data={comments}
        ListFooterComponent={() => {
          const isEmpty = comments.length === 0
          if (isEmpty || defaultQuery.limit && (comments.length < defaultQuery.limit)) {
            return null
          }

          return <Button onPress={loadMore}>{i18n.t('commentSection.loadMore')}</Button>;
        }}
        ListEmptyComponent={<EmptyComponent />}
        keyExtractor={(comment) => comment.id}
        renderItem={
          ({ item: comment }) => {
            return (
              <Comment
                comment={comment}
                reportComment={reportComment}
                setReplyTo={setReplyTo}
                setShowRepliesTo={setShowRepliesTo}
              />
            )
          }}
      />
      <PostComment
        guideId={guideId}
        addComment={addComment}
        replyTo={replyTo}
        setReplyTo={setReplyTo}
        addReply={addReplyTo}
        setShowRepliesTo={setShowRepliesTo}
      />
      <Replies
        guideId={guideId}
        showRepliesTo={showRepliesTo}
        setShowRepliesTo={setShowRepliesTo}
        setReplyTo={setReplyTo}
        reportComment={reportComment}
      />
    </View>
  )
}

function EmptyComponent() {
  const i18n = useI18n()
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{i18n.t('commentSection.empty')}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16
  },
  text: {
    textAlign: 'center'
  }
})