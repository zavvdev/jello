import { cond, Either as E, Task } from "jello-fp";
import { MESSAGES } from "jello-messages";
import { boardsRepo } from "~/core/infrastructure/repositories/boards.repository";
import { Result } from "./result";

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
