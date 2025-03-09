import React from "react";
import { render, screen, fireEvent } from '@testing-library/react';
import Counter from '../src/components/Counter';

test('näyttää oikean alkulukeman', () => {
    render(<Counter />);
    expect(screen.getByText("Count: 0")).toBeInTheDocument();
});

test('kasvattaa lukemaa, kun nappia painetaan', () => {
    render(<Counter />);

    // Jos useampi nappi löytyy, valitaan ensimmäinen
    const button = screen.getAllByRole("button", { name: "Increase" })[0];

    fireEvent.click(button);
    expect(screen.getByText("Count: 1")).toBeInTheDocument();
});