import React from 'react'
import "dom-testing-library/extend-expect"
import Joke from "../joke"
import JokeGenerator from "../jokeGenerator"
import { render, Simulate, wait } from "react-testing-library"
import * as axios from "axios"
import MockAxios from "axios-mock-adapter"

const mock = new MockAxios(axios, { delayResponse: Math.random() * 500});
afterAll(() => mock.restore());

test("Joke component receives props and then renders text", () => {
    const { getByTestId } = render(
        <Joke text="The funniest joke this year." />
    );

expect(getByTestId("joke-text")).toHaveTextContent(
    "The funniest joke this year."
);


test(" 'JokeGenerator' component fetches a random joke and renders it", async () => {
    mock.onGet().replyOnce(200, {
        value: {
            joke: "Really funny joke!"
        }
    });
    
    const { getByText } = render(<JokeGenerator />);

    expect(getByText("You haven't loaded any joke yet!")).toBeInTheDOM();

Simulate.click(getByText("Load a random joke"));
expect(queryByText("You haven't loaded any joke yet!")).not.toBeInTheDOM();
expect(queryByText("Loading...")).toBeInTheDOM();
await wait(() => expect(queryByText("Loading...")).not.toBeInTheDOM());
expect(queryByTestId("joke-text")).toBeInTheDOM();

})
});
