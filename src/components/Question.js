import Options from "./Options";
export default function Question({ question, dispatch, answer }) {
  return (
    <div className="question-container">
      <h4>{question.question}</h4>
      <Options
        question={question}
        dispatch={dispatch}
        answer={answer}
      ></Options>
    </div>
  );
}
