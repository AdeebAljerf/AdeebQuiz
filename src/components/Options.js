export default function Options({ question, dispatch, answer }) {
  const isSelected = answer !== null;
  return (
    <div className="options">
      {question.options.map((option, index) => (
        <button
          className={`btn btn-option ${index === answer ? "answer" : ""} ${
            isSelected
              ? index === question.correctOption
                ? "correct"
                : "wrong"
              : ""
          } `}
          key={option}
          onClick={() => {
            dispatch({ type: "newAnswer", payload: index });
          }}
          disabled={answer !== null}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
