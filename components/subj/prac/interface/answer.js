import { CostumeData } from "../index";
import { ChangeAnswer } from "./index";
import { useContext, useState, useEffect } from "react";
import Style from "styles/subj/prac/answer/yesno.module.scss";

export default function Answer({ props }) {
  const { cat, index } = props;
  const { setExpectedLength } = useContext(CostumeData);
  useEffect(() => {
    setExpectedLength(index);
  }, []);
  if (cat === "true/false") return <YesNo index={index} />;
  if (cat === "direct-text") return <DirectText props={props} />;
}

function YesNo({ index }) {
  const [answer, setAnswer] = useState(undefined);
  const { setAnswers, answers } = useContext(ChangeAnswer);
  const { result } = useContext(CostumeData);
  const Answerhandler = state => {
    if (!result) {
      setAnswer(state ? "نعم" : "لا");
      setAnswers(arr => {
        arr[index] = state ? "نعم" : "لا";
        return arr;
      });
    }
  };

  if (answers.length === 0 && answer !== undefined) setAnswer(undefined);
  return (
    <div className={Style.yesNo}>
      <button
        className={
          answer === "لا"
            ? result
              ? result.correction[index] === answers[index]
                ? Style.correct
                : Style.incorrect
              : Style.selected
            : Style
        }
        onClick={() => Answerhandler(false)}
      >
        لا
      </button>
      <button
        className={
          answer === "نعم"
            ? result
              ? result.correction[index] === answers[index]
                ? Style.correct
                : Style.incorrect
              : Style.selected
            : ""
        }
        onClick={() => Answerhandler(true)}
      >
        نعم
      </button>
    </div>
  );
}

function DirectText({ props }) {
  const { list, index } = props;
  const [answer, setAnswer] = useState(undefined);
  const { setAnswers, answers } = useContext(ChangeAnswer);
  const { result } = useContext(CostumeData);
  const Answerhandler = choosen => {
    if (!result) {
      setAnswer(choosen);
      setAnswers(arr => {
        arr[index] = choosen;
        return arr;
      });
    }
  };
  if (answers.length === 0 && answer !== undefined) setAnswer(undefined);
  return (
    <ul className={Style.direct_text}>
      {list.map((e, index) => (
        <li
          className={
            answer === e
              ? result
                ? result.correction[index] === answers[index]
                  ? Style.correct
                  : Style.incorrect
                : Style.selected
              : ""
          }
          onClick={() => Answerhandler(e)}
          key={`direct-text-${index}`}
        >
          {e}
        </li>
      ))}
    </ul>
  );
}
