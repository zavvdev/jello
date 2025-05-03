"use client";

import { useTranslation } from "react-i18next";
import {
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";
import { TextArea } from "~/app/components/atoms/text-area";
import { Button } from "~/app/components/atoms/button";
import { ApiErrors } from "~/app/components/molecules/api-errors";
import styles from "./styles.module.css";
import { Comment } from "./_components/atoms/comment";
import { mutateComment } from "../../../actions";

/**
 * @param {{
 *  userId: number;
 *  taskId: number;
 *  boardId: number;
 *  comments: Array<{
 *    id: string;
 *    body: string;
 *    author: {
 *      id: string;
 *      username: string;
 *      first_name: string;
 *      last_name: string;
 *    };
 *    created_at: string;
 *  }>;
 * }} param0
 */
export function FormComments({ userId, taskId, boardId, comments }) {
  var { t } = useTranslation(undefined, {
    keyPrefix: "comments",
  });

  var { 0: body, 1: setBody } = useState("");
  var { 0: editId, 1: setEditId } = useState(0);

  var {
    0: mutateState,
    1: mutateAction,
    2: isCommentMutating,
  } = useActionState(mutateComment);

  var handleSubmit = (e) => {
    e.preventDefault();
    var formData = new FormData(e.currentTarget);
    startTransition(() => {
      mutateAction(formData);
    });
  };

  useEffect(() => {
    if (mutateState?.success && !isCommentMutating) {
      setBody("");
      setEditId(0);
    }
  }, [mutateState?.success, setBody, isCommentMutating, setEditId]);

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h2>{t("title")}</h2>
      </div>
      <div className={styles.comments}>
        {comments.length === 0
          ? t("empty")
          : comments.map((comment) => (
              <Comment
                key={comment.id}
                canEdit={userId === comment.author.id}
                id={comment.id}
                body={comment.body}
                author={comment.author}
                createdAt={comment.created_at}
                taskId={taskId}
                boardId={boardId}
                onEdit={() => {
                  setEditId(comment.id);
                  setBody(comment.body);
                }}
              />
            ))}
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input type="hidden" name="taskId" value={taskId} />
        <input type="hidden" name="boardId" value={boardId} />
        {!!editId && (
          <input type="hidden" name="commentId" value={editId} />
        )}
        <TextArea
          name="body"
          placeholder={t("placeholder")}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={8}
        />
        <Button type="submit" disabled={isCommentMutating}>
          {editId ? t("save") : t("add")}
        </Button>
        {mutateState?.success === false && (
          <ApiErrors t={t} validation data={mutateState} />
        )}
      </form>
    </div>
  );
}
