import { ISerializedComment } from "@org/contracts";
import { StyleSheet } from "react-native";
import { Card, MD3Theme, Text, useTheme } from "react-native-paper";

type Props = {
  replyTo: ISerializedComment
}

export default function ReplyCard({ replyTo }: Props) {
  const styles = makeStyles(useTheme())

  const getCreatedBy = (replyTo: ISerializedComment) => {
    if (replyTo.createdBy && 'username' in replyTo.createdBy) {
      return replyTo.createdBy.username
    }

    return ''
  }

  return (
    <Card
      mode="contained"
      style={styles.card}
    >
      <Card.Title title={`Respondendo a ${getCreatedBy(replyTo)}`} titleStyle={styles.authorText} />
      <Card.Content>
        <Text
          variant="bodyMedium"
          style={styles.comment}
        >
          {replyTo.content}
        </Text>
      </Card.Content>
    </Card>
  )
}

const makeStyles = ({ colors }: MD3Theme) => {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.surface
    },
    authorText: {
      color: colors.primary
    },
    comment: {
      color: colors.onBackground
    }
  })
};