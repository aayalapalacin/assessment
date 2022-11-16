import { Fragment, useEffect, useState } from "react";
import { StoreContext } from "@store/StoreProvider";
import styles from "@styles/Home.module.css";
import checkBoxStyle from "@styles/multiselect.module.css";
import { useContext } from "react";
import { types } from "@store/reducer";
import Answer from "../Answer";
import Link from "next/link";
import { useRouter } from "next/router";
import { getThreshold } from "src/pages/quiz/[slug]";

const QuizCard = () => {
  const [store, dispatch] = useContext(StoreContext);
  const questions = store.questions;
  const currentQuestion = store.currentQuestion;
  const [threshold, setThreshold] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [successNext, setSuccessNext] = useState("");
  const [failMessage, setFailMessage] = useState("");
  const [failNext, setFailNext] = useState("");
  const [finalScoreReady, setFinalScoreReady] = useState(0);
  let thresholdItems= [];

  const router = useRouter();
  const getRandom = (type) => {
    const index = Math.floor(Math.random() * store.templates[type].length);
    return store.templates[type][index];
  };

  // console.log("CURRENT_QUESTIONS", questions)
  const verifyAnswer = (score) => {
    if (score === 1) {
      dispatch({
        type: types.setGetCorrect,
        payload: true,
      });
      dispatch({
        type: types.setScore,
      });
      setTimeout(() => {
        dispatch({
          type: types.setGetCorrect,
          payload: false,
        });
      }, 1300);
      return getRandom("correct");
    } else {
      return getRandom("incorrect");
    }
  };

  const getResponse = (score) => {
    dispatch({
      type: types.setGetAnswer,
      payload: true,
    });
    dispatch({
      type: types.setSelectedAnswer,
      payload: verifyAnswer(score),
    });
    setTimeout(() => {
      dispatch({
        type: types.setGetAnswer,
        payload: false,
      });
      dispatch({
        type: types.setMultiAnswerSelection,
        payload: [],
      });
      boxesArr.find((i) => (i.checked === true ? (i.checked = false) : null));
    }, 1300);
  };

  let boxes = document.getElementsByName("isMultiselect");
  let multiselection = [];
  var boxesArr = Array.prototype.slice.call(boxes, 0);
  let checkedBoxes;

  const verifyCurrentCheckbox = () => {
    checkedBoxes = boxesArr.filter((checkbox) => {
      return checkbox.checked;
    });

    multiselection = checkedBoxes.map((checkbox) => {
      return parseInt(checkbox.value);
    });
    dispatch({
      type: types.setMultiAnswerSelection,
      payload: multiselection,
    });
  };

  const selectAnswer = (score) => {
    getResponse(score);
    if (currentQuestion < questions.length - 1) {
      dispatch({
        type: types.setCurrentQuestion,
      });
    } else {
      clearInterval(store.timerRef);
      dispatch({
        type: types.setFinalScore,
        payload: true,
      });
    }
  };

  useEffect(() => {
    if (questions.length <= 0) {
      clearInterval(store.timerRef);
      dispatch({
        type: types.setFinalScore,
        payload: true,
      });

      setTimeout(() => {
        router.push("/");
      }, 5500);
    }
  }, [questions]);

  useEffect(async () => {
    if (store.showFinalScore) {
      console.log("test Thresh");
      const response = await getThreshold(router.query.slug);
      console.log("response.data", response.data);

      setThreshold(response.data);
      setFinalScoreReady(store.score);
      if(response.data){
        for(let i = 0; i < response.data.length; i++){
            console.log(response.data[i].score_threshold,"score thresh")
            console.log(store.score,"score store")
            
            if(store.score >= response.data[i].score_threshold ){
                thresholdItems.push(response.data[i])    
              }
              else {
                setFailMessage(response.data[response.data.length - 1].fail_message)
                setFailNext([response.data.length - 1].fail_next)
              }
            }
            

              setSuccessMessage(thresholdItems[0]?.success_message)
              setSuccessNext(thresholdItems[0]?.success_next)
            
            console.log("thresholdItems", thresholdItems)
          // response.data.forEach((e,index) =>{
          //   thresholdObj[e.score_threshold]= e;
          //   thresholdNum.push(e.score_threshold);
          //   console.log(e.score_threshold,"score thresh")
          //   console.log(store.score,"score store")
          //   if(store.score >= 0 && store.score < ){}
          //   if(store.score >= e.score_threshold){
          //     setSuccessMessage(e.success_message)
          //     setSuccessNext(e.success_next)
          //   }
          //   else if(store.score < e.score_threshold && index == response.data.length - 1){
          //      setFailMessage(e.fail_message)
          //      setFailNext(e.fail_next)
          //   }
          // })
          
          // setThreshold(thresholdObj);
        }

      }
    }, [store.showFinalScore]);
    console.log(finalScoreReady, "finalScoreReady State");
    console.log(threshold, "threshold");
    
    console.log(successMessage, "succesMessage");
    console.log(successNext, "successNext");
    console.log(failMessage, "failMessage");
    console.log(failNext, "failNext");
  
  const submitMultiselect = () => {
    let verifyError = store.multiAnswerSelection.find((score) => score === 0);

    if (verifyError === 0) {
      // console.log("INCORRECT", verifyError)
      return selectAnswer(verifyError);
    } else {
      // console.log("CORRECT", 1)
      return selectAnswer(1);
    }
  };

  return (
    <div className={styles.container}>
      {store.getAnswer === true ? <Answer /> : null}

      {store.showFinalScore === false && questions.length > 0 ? (
        <>
          <h1 className={styles.quiz_title_card}>
            {questions[currentQuestion].title}
          </h1>

          <div className={styles.quiz_grid}>
            {Array.isArray(questions[currentQuestion].options) &&
              questions[currentQuestion].options.map((option, i) => {
                return (
                  <Fragment key={i}>
                    {questions[currentQuestion].question_type === "SELECT" ? (
                      <button
                        key={option.id}
                        name="isSelect"
                        onClick={() => selectAnswer(option.score)}
                        className={styles.quiz_card}
                      >
                        <h2 className={styles.buttonTextSelector}>
                          {option.title}
                        </h2>
                      </button>
                    ) : questions[currentQuestion].question_type ===
                      "SELECT_MULTIPLE" ? (
                      <>
                        <label
                          className={checkBoxStyle.multiSelect_label}
                          key={option.id}
                        >
                          <input
                            value={option.score}
                            name="isMultiselect"
                            type="checkbox"
                            onChange={() => verifyCurrentCheckbox()}
                            className={checkBoxStyle.buton_input}
                          />
                          <h2
                            className={checkBoxStyle.button_span}
                            style={{ fontWeight: "normal" }}
                          >
                            {option.title}
                          </h2>
                        </label>
                      </>
                    ) : (
                      <p>an error occurred, please report to your teacher</p>
                    )}
                  </Fragment>
                );
              })}
          </div>

          {questions[currentQuestion].question_type === "SELECT_MULTIPLE" ? (
            <>
              {store.multiAnswerSelection.length <= 1 ? (
                <button
                  disabled
                  className={checkBoxStyle.multiSelect_SubmitButton}
                  style={{ textAlign: "center" }}
                >
                  <h2 style={{ fontWeight: "normal" }}>
                    Select 2 or more options
                  </h2>
                </button>
              ) : (
                <button
                  onClick={() => submitMultiselect()}
                  className={checkBoxStyle.multiSelect_SubmitButton}
                  style={{ textAlign: "center" }}
                >
                  <h2 style={{ fontWeight: "normal" }}>Send</h2>
                </button>
              )}
            </>
          ) : null}
        </>
      ) : (
        <>
          {/* <Link href={"/"} >
       <a className={styles.backToHome}>
        Back to Home
      </a> 
      </Link> */}

          {questions.length === 0 && (
            <>
              <span
                style={{
                  fontSize: "var(--xxl)",
                  margin: "10rem 10% 20px 10%",
                  textAlign: "center",
                }}
              >
                This quizz not have any questions to answer :c
              </span>
              <span
                style={{
                  fontSize: "var(--m)",
                  fontWeight: "200",
                  margin: "20px 10%",
                  textAlign: "center",
                }}
              >
                redirecting to home...
              </span>
            </>
          )}

          {store.showFinalScore === true && questions.length > 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                margin: "10rem 0",
              }}
            >
              <span
                style={{
                  fontSize: "var(--xxl)",
                  textAlign: "center",
                  margin: "20px 0",
                }}
              >
                {Math.floor((store.score / questions.length) * 100)}% accuracy
              </span>
              <span style={{ fontSize: "var(--m)", margin: "20px 0" }}>
                Your Score: {store.score} / {questions.length}
                <br />
              </span>
              <span style={{ fontSize: "var(--m)", margin: "20px 0" }}>
                Finished in: {store.timer} Seconds
              </span>
              <button
                onClick={async () => {
                  const response = await getThreshold(router.query.slug);
                  console.log(response.data, "resp");
                }}
              >
                threshold
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QuizCard;
