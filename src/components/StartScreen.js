export default function StartScreen({ numQuestions, dispatch }) {
  return (
    <div className="start">
      <h2>How much do you know me ?</h2>
      <h3>{numQuestions} questions to test you</h3>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "active" })}
      >
        Let's start
      </button>
    </div>
  );
}
