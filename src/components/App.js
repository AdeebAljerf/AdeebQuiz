import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
//?---------------------------------------------------------//

const initialState = {
  questions: [],

  status: "loading",

  index: 0,

  answer: null,

  points: 0,

  highScore: 0,
};
//?---------------------------------------------------------//

function reducer(state, action) {
  switch (action.type) {
    //_____________________________________//
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };
    //_____________________________________//
    case "dataFailed":
      return { ...state, status: "error" };
    //_____________________________________//
    case "active":
      return { ...state, status: "active" };
    //_____________________________________//
    case "newAnswer":
      const question = state.questions[state.index];
      return {
        ...state,
        answer: action.payload,
        points:
          state.points +
          (action.payload === question.correctOption ? question.points : 0),

        //? this this wrong cause i cant take point derictly i have to write state.points and state.question and...
        // points + `${action.payload === question[index].currectOption}` ? 1 : 0,
      };
    //_____________________________________//
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    //_____________________________________//
    case "finished":
      return {
        ...state,
        status: "finished",
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };
    //_____________________________________//
    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        status: "ready",
      };
    //_____________________________________//
    default:
      throw new Error("action unknown");
  }
}
//?---------------------------------------------------------//

export default function App() {
  const [{ questions, status, index, answer, points, highScore }, dispatch] =
    useReducer(reducer, initialState);
  //?--------------------------------//

  const numQuestions = questions.length;
  const maxPoints = questions.reduce((acc, question) => {
    return acc + question.points;
  }, 0);

  //?------------EFFECT------------//

  useEffect(function () {
    async function fetchData() {
      try {
        const response = await fetch(
          "https://my-json-server.typicode.com/AdeebAljerf/AdeebQuiz-data/db"
        );
        const data = await response.json();
        if (data && data.questions && Array.isArray(data.questions)) {
          dispatch({ type: "dataReceived", payload: data.questions });
        } else {
          throw new Error("Invalid data structure");
        }
      } catch (err) {
        dispatch({ type: "dataFailed" });
        console.error("Error fetching data:", err);
      }
    }
    fetchData();
  }, []);

  //?------------JSX------------//

  return (
    <>
      <div className="app">
        <Header></Header>

        <Main>
          {status === "loading" && <Loader></Loader>}
          {status === "error" && <Error></Error>}
          {status === "ready" && (
            <StartScreen
              numQuestions={numQuestions}
              dispatch={dispatch}
            ></StartScreen>
          )}

          {status === "active" && (
            <>
              <Progress
                index={index}
                numQuestions={numQuestions}
                maxPoints={maxPoints}
                points={points}
                answer={answer}
              ></Progress>
              <Question
                question={questions[index]}
                dispatch={dispatch}
                answer={answer}
              ></Question>
              <NextButton
                dispatch={dispatch}
                answer={answer}
                numQuestions={numQuestions}
                index={index}
              ></NextButton>
            </>
          )}

          {status === "finished" && (
            <FinishScreen
              points={points}
              maxPoints={maxPoints}
              highScore={highScore}
              dispatch={dispatch}
            ></FinishScreen>
          )}
        </Main>
      </div>
    </>
  );
}
