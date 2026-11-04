import { StyleSheet, View } from "react-native";
import { Avatar, Button, Card, IconButton, Text, useTheme } from "react-native-paper";

import { ISerializedComment } from "@org/contracts";
import { useState } from "react";
import useI18n from "../../../contexts/i18n/useI18n";
import { ApiService } from "../../../services/api/api.service";
import SideMenu from "./side-menu/SideMenu";

type Props = {
  comment: ISerializedComment,
  useAlternativeColors?: boolean,
  setReplyTo: React.Dispatch<React.SetStateAction<ISerializedComment | null>>,
  setShowRepliesTo: React.Dispatch<React.SetStateAction<ISerializedComment | null>>,
  reportComment: (comment: ISerializedComment) => void
}

export default function Comment({ comment, useAlternativeColors = false, setReplyTo, setShowRepliesTo, reportComment }: Props) {
  const i18n = useI18n()
  const theme = useTheme()

  const [liked, setLiked] = useState(comment.liked || false)
  const [likeCount, setLikeCount] = useState(comment.likeCount)

  let createdBy = i18n.t('comment.deletedUser')
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

  const onSideMenuClick = () => {
    setShowRepliesTo(null)
  }

  return (
    <Card
      mode="contained"
      style={[
        styles.card,
        {
          backgroundColor: useAlternativeColors ? theme.colors.surface : theme.colors.surfaceVariant,
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
          <View>
            <SideMenu comment={comment} reportComment={reportComment} onClick={onSideMenuClick} />
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
            icon={'reply'}
            mode="text"
            compact
            onPress={() => setReplyTo(comment)}
          >
            {i18n.t('comment.reply')}
          </Button>

          <Button
            icon={'message-reply-text'}
            mode="text"
            compact
            onPress={() => {
              setShowRepliesTo((old) => {
                if (old?.id === comment.id) return null
                return comment
              })
            }}
          >
            {i18n.t('comment.replies')}
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
    gap: 8,
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