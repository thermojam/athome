'use client';

import {useEffect, useReducer, useRef} from 'react';
import {QUESTIONS, PROFILES, CONTENT} from '@/lib/quiz-data';
import {quizReducer, initialState} from '@/lib/quiz-logic';
import {reachGoal} from '@/lib/analytics';
import {ProgressBar} from './ProgressBar';
import {QuizQuestion} from './QuizQuestion';
import {QuizResult} from './QuizResult';

const TOTAL = QUESTIONS.length;

export function Quiz() {
    const [state, dispatch] = useReducer(quizReducer, initialState);
    const startSent = useRef(false);
    const completeSent = useRef(false);

    useEffect(() => {
        if (state.finished && state.result && !completeSent.current) {
            completeSent.current = true;
            reachGoal('quiz_complete');
        }
    }, [state.finished, state.result]);

    const handleAnswer = (profile: 'health' | 'body' | 'energy') => {
        if (!startSent.current) {
            startSent.current = true;
            reachGoal('quiz_start');
        }
        dispatch({type: 'ANSWER', profile});
    };

    const handleReset = () => {
        startSent.current = false;
        completeSent.current = false;
        dispatch({type: 'RESET'});
    };

    return (
        <section id="test" className="border-b border-[--line] bg-bg-primary px-4 py-20 md:py-28">
            <div className="mx-auto max-w-2xl">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-tx2">
                    {CONTENT.quiz.kicker}
                </p>
                <h2 className="mt-2 font-display text-2xl text-tx md:text-4xl">
                    {CONTENT.quiz.h2}
                </h2>
                <p className="mt-4 text-base text-tx2">{CONTENT.quiz.sub}</p>

                <div className="mt-10 rounded-[--radius-xl] border border-[--line] bg-bg2 p-6 md:p-8">
                    <ProgressBar step={state.step} total={TOTAL}/>

                    <div className="mt-8">
                        {!state.finished && state.step < TOTAL ? (
                            <QuizQuestion
                                question={QUESTIONS[state.step]}
                                onAnswer={handleAnswer}
                            />
                        ) : state.result ? (
                            <QuizResult profile={PROFILES[state.result]} onRestart={handleReset}/>
                        ) : null}
                    </div>
                </div>
            </div>
        </section>
    );
}
