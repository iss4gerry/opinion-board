import React, { useActionState, use } from "react";

import Submit from "./Submit";
import { OpinionsContext } from "../store/opinions-context";

export function NewOpinion() {
  const { addOpinion } = use(OpinionsContext);
  async function submitAction(prevFormState, formData) {
    const name = formData.get("userName");
    const title = formData.get("title");
    const opinion = formData.get("body");

    let errors: string[] = [];
    if (!name) {
      errors.push("Name is required. Please provide your full name.");
    }
    if (!title) {
      errors.push("Title is required. Please provide a title for your input.");
    }
    if (!opinion) {
      errors.push("Your opinion is required. Please share your thoughts.");
    }

    if (errors.length > 0) {
      return {
        errors,
        enteredValues: {
          name,
          title,
          opinion,
        },
      };
    }

    await addOpinion({ title:title, body:opinion, userName:name });

    return {
      errors: null,
    };
  }

  const [formData, formAction, pending] = useActionState(submitAction, {
    errors: null,
  });
  return (
    <div id="new-opinion">
  <h2>Share your opinion!</h2>
  <form action={formAction}>
    <div className="control-row">
      <p className="control">
        <label htmlFor="userName">
          <span className="input-icon">👤</span> Your Name
        </label>
        <input
          type="text"
          id="userName"
          name="userName"
          placeholder="Enter your name"
          defaultValue={formData.enteredValues?.name}
        />
      </p>

      <p className="control">
        <label htmlFor="title">
          <span className="input-icon">📝</span> Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="Enter a title for your opinion"
          defaultValue={formData.enteredValues?.title}
        />
      </p>
    </div>

    <p className="control">
      <label htmlFor="body">
        <span className="input-icon">💬</span> Your Opinion
      </label>
      <textarea
        id="body"
        name="body"
        placeholder="Write your opinion here"
        rows={5}
        defaultValue={formData.enteredValues?.opinion}
      ></textarea>
    </p>

    {formData.errors && (
      <ul>
        {formData.errors.map((message) => {
          return (
            <li key={message} className="errors">
              {message}
            </li>
          );
        })}
      </ul>
    )}

    <div className="actions">
      <Submit />
    </div>
  </form>
</div>

  );
}
