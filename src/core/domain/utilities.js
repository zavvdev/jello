import {
  compose,
  cond,
  Either as E,
  mergeObjects,
  Task,
} from "jello-fp";
import { MESSAGES } from "jello-messages";
import { boardsRepo } from "~/core/infrastructure/repositories/boards.repository";
import { Result } from "./result";
import { taskCommentsRepo } from "../infrastructure/repositories/task-comments.repository";

export var $checkAuthority = (predicate, boardsRepo_) => {
  var repo = boardsRepo_ || boardsRepo;

  var unauthorized = () =>
    E.left(Result.of({ message: MESSAGES.unauthorizedAction }));

  return Task.of(repo.getUserRole.bind(repo)).map(
    E.chain(cond(unauthorized, [predicate, E.right])),
  );
};

export var $checkBoardExistance = (boardsRepo_) => {
  var repo = boardsRepo_ || boardsRepo;

  var noBoard = () =>
    E.left(
      Result.of({
        message: MESSAGES.boardNotFound,
      }),
    );

  return Task.of(repo.userHasBoard.bind(repo)).map(
    E.chain(cond(noBoard, [Boolean, E.right])),
  );
};

export var $checkTaskCommentOwnership = (taskCommentsRepo_) => {
  var repo = taskCommentsRepo_ || taskCommentsRepo;

  var notAllowed = () =>
    E.left(
      Result.of({
        message: MESSAGES.unauthorizedAction,
      }),
    );

  var matchesUser = ({ user_id, author_id }) => user_id === author_id;

  return Task.all(
    Task.of(E.asyncRight),
    Task.of(repo.getMeta.bind(repo)),
  )
    .map(E.joinAll(compose(E.right, mergeObjects)))
    .map(E.chain(cond(notAllowed, [matchesUser, E.right])));
};
