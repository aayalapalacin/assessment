import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [quizList, setQuizList] = useState([]);

  useEffect(() => {
    axios
      .get("https://breathecode.herokuapp.com/v1/assessment/")
      .then((res) => {
        console.log(res);
        setQuizList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  console.log("ALL QUIZZZ", quizList);

  return (
    <div className={styles.container}>
      <Head>
        <title>Assesment</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to{" "}
          <a
            href="https://github.com/breatheco-de/assessment"
            target="_blank"
            rel="noopener noreferrer"
          >
            Assesment
          </a>
        </h1>

        <p className={styles.description}>
          Get started by editing{" "}
          <code className={styles.code}>pages/index.js</code>
        </p>

        <div className={styles.grid}>
          {quizList.length === 0 ? (
            <p>Loading...</p>
          ) : (
            quizList.map((quiz) => {
              return (
                <a href="https://nextjs.org/docs" className={styles.card}>
                  <h2>{quiz.title} &rarr;</h2>
                  <p>slug: {quiz.slug}</p>
                </a>
              );
            })
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by Breathe Code
        </a>
      </footer>
    </div>
  );
}
