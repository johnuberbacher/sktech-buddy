 import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import LetterButton from "../components/LetterButton";
import Button from "../components/Button";
import WORDS from "../constants/words";
import COLORS from "../constants/colors";

const randomIndex = Math.floor(Math.random() * WORDS.length);
const staticWord = WORDS[randomIndex].word;
const difficulty = WORDS[randomIndex].difficulty;
let difficultyLength = 12;
const emptyButtons = Array(staticWord.length).fill(null);

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};
  
const LetterBoard = () => {
  const [optionLetters, setOptionLetters] = useState([]);
  const [answerLetters, setAnswerLetters] = useState([]);
  const [isSelected, setIsSelected] = useState(Array(12).fill(false));
  const [victoryStyles, setVictoryStyles] = useState(null);

  useEffect(() => {
    const staticWordFrequencyMap = new Map(
      [...staticWord].map((char) => [char, 1])   
    );
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    
    // Ensure that staticWord letters are included in optionLetters
    const staticWordLetters = generateCharactersFromFrequency(
      staticWordFrequencyMap,
      staticWord.length
    );

    const usedChars = new Set([...staticWordLetters]);
    console.log(difficulty);
    if (difficulty === "medium") {
      difficultyLength = 14;
    } else if (difficulty === "hard") {
      difficultyLength = 16;
    }

    console.log(staticWord);
    console.log(difficulty );

    const randomLetters = Array.from(
      { length: difficultyLength - staticWord.length },
      () => {
        let randomChar;
        do {
          randomChar = alphabet[Math.floor(Math.random() * alphabet.length)];
        } while (usedChars.has(randomChar));
        usedChars.add(randomChar);
        return randomChar;
      }
    );

    const combinedLetters = staticWordLetters.concat(randomLetters);
    shuffleArray(combinedLetters);
    setOptionLetters(combinedLetters);
  }, [staticWord]);

  const generateCharactersFromFrequency = (frequencyMap, totalCharacters) => {
    const characters = [];
    const usedChars = new Set(); // Keep track of used characters

    const uniqueChars = Array.from(frequencyMap.keys());

    while (characters.length < totalCharacters && uniqueChars.length > 0) {
      const char = uniqueChars.shift();
      for (let i = 0; i < frequencyMap.get(char); i++) {
        characters.push(char);
        usedChars.add(char);
      }
    }

    const remainingCharacters = totalCharacters - characters.length;

    // Add random characters from the alphabet to meet the remainingCharacters requirement
    for (let i = 0; i < remainingCharacters; i++) {
      let randomChar;
      do {
        randomChar = alphabet[Math.floor(Math.random() * alphabet.length)];
      } while (usedChars.has(randomChar));

      characters.push(randomChar);
      usedChars.add(randomChar);
    }

    return characters;
  };

  const handleLetterButtonClick = (title, index) => {
    setAnswerLetters((prevSelected) => {
      const selectedIndex = prevSelected.indexOf(title);

      // Check if the letter is already selected
      if (selectedIndex !== -1) {
        const updatedSelected = [...prevSelected];
        updatedSelected.splice(selectedIndex, 1);

        setIsSelected((prevSelectedStatus) => {
          const updatedSelectedStatus = [...prevSelectedStatus];
          const originalIndexInLetterBoard = optionLetters.indexOf(title);

          if (originalIndexInLetterBoard !== -1) {
            updatedSelectedStatus[originalIndexInLetterBoard] = false;
          }

          return updatedSelectedStatus;
        });

        return updatedSelected;
      }

      // Check if the maximum number of selected letters is reached (6)
      if (prevSelected.length >= difficultyLength / 2) {
        return prevSelected;
      }

      return [...prevSelected, title];
    });

    // Only handle UI update for the letter button if the maximum is not reached
    if (answerLetters.length < difficultyLength / 2) {
      setIsSelected((prevSelectedStatus) => {
        const originalIndexInLetterBoard = optionLetters.indexOf(title);
        if (originalIndexInLetterBoard !== -1) {
          const updatedSelectedStatus = [...prevSelectedStatus];
          updatedSelectedStatus[originalIndexInLetterBoard] = true;
          return updatedSelectedStatus;
        }
        return prevSelectedStatus;
      });
    }

    if (answerLetters === staticWord) {
      console.log("YAY! You got it!");
    }
  };

  const handleSelectedLetterClick = (title, index) => {
    setAnswerLetters((prevSelected) => {
      const selectedIndex = prevSelected.indexOf(title);

      if (selectedIndex !== -1) {
        const updatedSelected = [...prevSelected];
        updatedSelected.splice(selectedIndex, 1);

        setIsSelected((prevSelectedStatus) => {
          const updatedSelectedStatus = [...prevSelectedStatus];
          const originalIndexInLetterBoard = optionLetters.indexOf(title);

          if (originalIndexInLetterBoard !== -1) {
            updatedSelectedStatus[originalIndexInLetterBoard] = false;
          }

          return updatedSelectedStatus;
        });

        return updatedSelected;
      }

      // Check if adding the letter exceeds difficultyLength / 2 letters
      if (prevSelected.length >= difficultyLength / 2) {
        return prevSelected;
      }

      return [...prevSelected, title];
    });

    if (index < answerLetters.length) {
      setIsSelected((prevSelectedStatus) => {
        const originalIndexInLetterBoard = optionLetters.indexOf(title);
        if (originalIndexInLetterBoard !== -1) {
          const updatedSelectedStatus = [...prevSelectedStatus];
          updatedSelectedStatus[originalIndexInLetterBoard] = false;
          return updatedSelectedStatus;
        }
        return prevSelectedStatus;
      });
    }
  };

  const wrapperStyles = StyleSheet.flatten([
    styles.wrapperStyles,
    victoryStyles,
  ]);

  return (
    <View style={{ width: "100%", marginBottom: 10 }}>
      <View style={wrapperStyles}>
        {answerLetters.map((letter, index) => (
          <LetterButton
            color="yellow"
            key={index}
            title={letter}
            onPress={() => handleSelectedLetterClick(letter, index)}
          />
        ))}
        {emptyButtons.slice(answerLetters.length).map((_, index) => (
          <LetterButton color="yellow" key={index} filled={false} />
        ))}
      </View>
      <View style={styles.topRow}>
        {optionLetters.slice(0, difficultyLength / 2).map((title, index) => (
          <LetterButton
            key={index}
            title={title}
            selected={isSelected[index]}
            onPress={() => handleLetterButtonClick(title, index)}
          />
        ))}
      </View>
      <View style={styles.secondRow}>
        {optionLetters
          .slice(difficultyLength / 2, difficultyLength)
          .map((title, index) => (
            <LetterButton
              key={index + 6}
              title={title}
              selected={isSelected[index + difficultyLength / 2]}
              onPress={() =>
                handleLetterButtonClick(title, index + difficultyLength / 2)
              }
            />
          ))}
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          paddingLeft: 10,
          paddingRight: 10,
          marginTop: 20,
        }}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapperStyles: {
    width: "100%",
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 20,
    paddingBottom: 10,
    marginBottom: 20,
  },
  wrapperVictoryStyles: {
    backgroundColor: "#ade053",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 10,
  },
  topRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    gap: 4,
    paddingLeft: 10,
    paddingRight: 10,
  },
  secondRow: {
    marginTop: 15,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    gap: 4,
    paddingLeft: 10,
    paddingRight: 10,
  },
  wrapperVictoryStyles: {
    backgroundColor: "#ade053",
  },
});

export default LetterBoard;