import { gql, useLazyQuery } from "@apollo/client";
import { MyCookie } from "pages/_app";
import { useEffect, useContext, useState } from "react";
import { useRouter } from "next/router";
import Style from "styles/subj/prac/training.module.scss";
import { CostumeData } from "../index";
const GET_QUESTION_SOLUTION = gql`
  query($uid: ID!, $mod: String!, $unit: String!, $subj: Int!) {
    train(uid: $uid, mod: $mod, unit: $unit, subj: $subj) {
      questions
      solutions
    }
  }
`;

export default function Training() {
  const cookie = useContext(MyCookie);
  const { pList } = useContext(CostumeData);
  const router = useRouter();
  const { mod, unit, subj } = router.query;
  const [trainme, { loading, data }] = useLazyQuery(GET_QUESTION_SOLUTION);
  const [show, setShow] = useState(false);
  const [train, setTrain] = useState(null);

  useEffect(() => {
    if (cookie && mod && !loading)
      trainme({
        variables: { mod, unit, subj: parseInt(subj), uid: cookie.uid }
      }).catch(err => {
        console.log({ mod, unit, subj: parseInt(subj), uid: cookie.uid });
      });
  }, [cookie, mod, subj, pList]);

  useEffect(() => {
    if (data && data.train) setTrain(data.train);
  }, [data]);

  const clickHandler = state => {
    if (train) {
      const type = typeof state;
      if (type === "boolean") setShow(!show);
      else if (type === "string")
        window.open(`https://drive.google.com/file/d/${state}/view`, "_blank");
    }
  };

  return (
    <div
      onClick={() => clickHandler(true)}
      className={`${Style.training} ${show ? Style.show : ""}`}
    >
      {train ? "تدريب" : "اجب بشكل صحيح للحصول على التدريب"}
      {train && (
        <>
          <div
            onClick={() => clickHandler(data.train.solutions)}
            className={Style.solutions}
          >
            الحلول
          </div>
          <div
            onClick={() => {
              clickHandler(data.train.questions);
            }}
            className={Style.questions}
          >
            الاسئلة
          </div>
        </>
      )}
    </div>
  );
}
