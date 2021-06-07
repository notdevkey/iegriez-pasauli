// General imports
import { useEffect, useState } from "react";
import axios from "axios";

// Styles & animations
import styles from "../styles/questions.module.scss";
import { motion } from "framer-motion";
import { fadeInUp } from "../models/animations/animations";

// Redux
import { connect } from "react-redux";
import { getQuestions, setCurrentQuestion } from "../actions/questions";
import { switchStage } from "../actions/game";
import { setPoints } from "../actions/points";
import Spinner from "./Spinner.component";
import { playTransition } from "../actions/transition";

export function Questions({
  points,
  gameObj,
  switchStage,
  setPoints,
  questions,
  isLoading,
  getQuestions,
  currentQuestion,
  setCurrentQuestion,
  playTransition,
}) {
  // Get questions for current item
  useEffect(() => {
    playTransition({
      title: "Viktorīna",
      description: "Vai esi spējīgs atminēt visus jautājumus?",
      length: 3000,
    });
    getQuestions(gameObj.object);
  }, []);

  const answer = (answer: boolean) => {
    // setCurrentQuestion({ ...currentQuestion, isCorrect: null });
    axios
      .get(`${process.env.HOST}/api/quiz/answers/`, {
        params: {
          id: questions[currentQuestion.index].id,
        },
      })
      .then((res) => {
        if (res.data[0].expected_answer == answer) {
          console.log("worked");
          setPoints({
            ...points,
            quiz: points.quiz + 5,
          });
          setCurrentQuestion({
            ...currentQuestion,
            isCorrect: true,
          });
        } else {
          setCurrentQuestion({
            ...currentQuestion,
            isCorrect: false,
          });
        }

        setTimeout(() => {
          setCurrentQuestion({
            index: currentQuestion.index + 1,
            isCorrect: null,
          });
          if (currentQuestion.index >= questions.length - 1) {
            switchStage(3);
          }
        }, 3000);
      });
  };

  return (
    <motion.div
      exit={{ opacity: 0 }}
      initial="initial"
      animate="animate"
      className={styles.questions}
    >
      {currentQuestion.isCorrect == null && (
        <div>
          <h1 style={{ WebkitUserSelect: "none" }}>Patiesība vai meli</h1>
          {isLoading && <Spinner />}
          <motion.h2 variants={fadeInUp} style={{ WebkitUserSelect: "none" }}>
            {questions && questions[currentQuestion.index]?.question}
          </motion.h2>
          <div className={styles["btn-container"]}>
            <button
              onClick={() => answer(true)}
              className={`${styles.btn} ${styles["btn-orange"]}`}
            >
              Patiesība
            </button>
            <button
              onClick={() => answer(false)}
              className={`${styles.btn} ${styles["btn-neutral"]}`}
            >
              Meli
            </button>
          </div>
        </div>
      )}
      {currentQuestion.isCorrect == true && (
        <div className={styles.overlay}>
          <div>
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="check"
              className={styles.icon}
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="#9aca3c"
                d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"
              ></path>
            </svg>
            <h1 style={{ WebkitUserSelect: "none" }}>Pareizi</h1>
            <h2 style={{ WebkitUserSelect: "none" }}>+5</h2>
          </div>
        </div>
      )}
      {currentQuestion.isCorrect == false && (
        <div className={styles.overlay}>
          <div>
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="times"
              className={styles.icon}
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 352 512"
            >
              <path
                fill="#FD6579"
                d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
              ></path>
            </svg>
            <h1 style={{ WebkitUserSelect: "none" }}>Nepareizi</h1>
          </div>
        </div>
      )}
    </motion.div>
  );
}

const mapStateToProps = (state) => ({
  gameObj: state.gameObj,
  questions: state.questions.questions,
  currentQuestion: state.questions.currentQuestion,
  isLoading: state.questions.isLoading,
  points: state.points,
});

export default connect(mapStateToProps, {
  getQuestions,
  setCurrentQuestion,
  switchStage,
  setPoints,
  playTransition,
})(Questions);
