import React, { use } from "react";
import { OpinionsContext } from "../store/opinions-context";
import { useActionState } from "react";
import { useOptimistic } from "react";

export function Opinion({ opinion: { id, title, body, userName, votes } }) {
  const {downvoteOpinion, upvoteOpinion} = use(OpinionsContext)

  const [ optimisticVotes, setVoteOptimistic ] = useOptimistic(votes, (prevVote, mode) => mode === 'up' ? prevVote + 1  : prevVote - 1)

  async function upAction () {
    setVoteOptimistic('up')
    await upvoteOpinion(id)
  }

  async function downAction () {
    setVoteOptimistic('down')
    await downvoteOpinion(id)
  }

  const [ upvoteFormState, upvoteFormAction, upvotePending ] = useActionState(upAction, null)
  const [ downvoteFormState, downvoteFormAction, downvotepending ] = useActionState(downAction, null)

  return (
    <article>
      <header>
        <h3>{title}</h3>
        <p>Shared by {userName}</p>
      </header>
      <p>{body}</p>
      <form className="votes">
        <button formAction={upvoteFormAction} disabled={upvotePending || downvotepending}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="m16 12-4-4-4 4" />
            <path d="M12 16V8" />
          </svg>
        </button>

        <span>{optimisticVotes}</span>

        <button formAction={downvoteFormAction} disabled={upvotePending || downvotepending}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M12 8v8" />
            <path d="m8 12 4 4 4-4" />
          </svg>
        </button>
      </form>
    </article>
  );
}
