import { StyleSheet, View } from "react-native";
import { Avatar, Button, Card, IconButton, Text, useTheme } from "react-native-paper";

import { ISerializedComment } from "@org/contracts";
import { useState } from "react";
import { ApiService } from "../../../services/api/api.service";

type Props = {
  comment: ISerializedComment,
  setReplyTo: React.Dispatch<React.SetStateAction<ISerializedComment | null>>
  setShowRepliesTo: React.Dispatch<React.SetStateAction<ISerializedComment | null>>
}

export default function Comment({ comment, setReplyTo, setShowRepliesTo }: Props) {
  const [liked, setLiked] = useState(comment.liked || false)
  const [likeCount, setLikeCount] = useState(comment.likeCount)

  const theme = useTheme()

  let createdBy = 'Deletado'
  if (comment.createdBy && 'username' in comment.createdBy) {
    createdBy = comment.createdBy.username
  }

  const createdAt = new Date(comment.createdAt).toLocaleString('pt-BR')

  const handleLike = (commentId: string) => {
    const request = liked ? ApiService.Comments.unlike : ApiService.Comments.like

    request(commentId)
      .then(() => {
        if (liked) {
          setLikeCount((oldValue) => {
            if (oldValue > 0) {
              return oldValue - 1
            }
            return 0
          })

          setLiked(false)
        } else {
          setLikeCount((oldValue) => oldValue + 1)
          setLiked(true)
        }
      })
      .catch(() => { })
  }

  return (
    <Card
      mode="contained"
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surfaceVariant,
        },
      ]}
    >
      <Card.Content style={{ paddingBottom: 0 }}>
        <View style={styles.header}>
          <Avatar.Text
            size={40}
            label={createdBy.slice(0, 2).toUpperCase()}
          />

          <View style={styles.author}>
            <Text variant="titleSmall">{createdBy}</Text>

            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              {createdAt}
            </Text>
          </View>
        </View>

        <Text
          variant="bodyMedium"
          style={styles.content}
        >
          {comment.content}
        </Text>

        <View style={styles.actions}>
          <View style={styles.like}>
            <IconButton
              iconColor={theme.colors.primary}
              icon={liked ? 'heart' : 'heart-outline'}
              size={20}
              onPress={() => handleLike(comment.id)}
              style={styles.likeButton}
            />

            <Text variant="labelMedium">
              {likeCount}
            </Text>
          </View>

          <Button
            mode="text"
            compact
            onPress={() => setReplyTo(comment)}
          >
            Responder
          </Button>
          <Button
            mode="text"
            compact
            onPress={() => setShowRepliesTo(comment)}
          >
            Respostas
          </Button>
        </View>
      </Card.Content>
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginBottom: 16,
    paddingBottom: 0,
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
  likeButton: {
    marginHorizontal: 0
  }
});