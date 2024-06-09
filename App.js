import * as React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Text, View, Button, Modal } from "react-native";
import Card from "./Card";
import Inicio from "./Inicio";

const cards = [
  "🐠", "🐡", "🐙", "🦈", "🌊", "🏝️",
];

export default function App() {
  const [board, setBoard] = React.useState(() => shuffle([...cards, ...cards]));
  const [selectedCards, setSelectedCards] = React.useState([]);
  const [matchedCards, setMatchedCards] = React.useState([]);
  const [score, setScore] = React.useState(0);
  const [timeLeft, setTimeLeft] = React.useState(25);
  const [isGameOver, setIsGameOver] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [gameStarted, setGameStarted] = React.useState(false);

  React.useEffect(() => {
    if (gameStarted && timeLeft > 0 && matchedCards.length < board.length) {
      const timerId = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearInterval(timerId);
    } else if (timeLeft === 0 || matchedCards.length === board.length) {
      setIsGameOver(true);
      setModalVisible(true);
    }
  }, [timeLeft, gameStarted, matchedCards]);

  React.useEffect(() => {
    if (selectedCards.length < 2) return;

    if (board[selectedCards[0]] === board[selectedCards[1]]) {
      setMatchedCards([...matchedCards, ...selectedCards]);
      setSelectedCards([]);
      setScore(score + 1);
    } else {
      const timeoutId = setTimeout(() => setSelectedCards([]), 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [selectedCards]);

  const handleTapCard = (index) => {
    if (!gameStarted) {
      setGameStarted(true);
    }
    if (selectedCards.length >= 2 || selectedCards.includes(index)) return;
    setSelectedCards([...selectedCards, index]);
  };

  const handleRestart = () => {
    setBoard(shuffle([...cards, ...cards]));
    setSelectedCards([]);
    setMatchedCards([]);
    setScore(0);
    setTimeLeft(25);
    setIsGameOver(false);
    setModalVisible(false);
    setGameStarted(true); //Juego  iniciado
  };
  
  const handleGoToStart = () => {
    setModalVisible(false);
    setGameStarted(false);
    setBoard(shuffle([...cards, ...cards]));
    setSelectedCards([]);
    setMatchedCards([]);
    setScore(0);
    setTimeLeft(25);
  };
  

  const didPlayerWin = () => matchedCards.length === board.length;

  return (
    <SafeAreaView style={styles.container}>
      {!gameStarted ? (
        <Inicio onStart={() => setGameStarted(true)} />
      ) : (
        <View style={styles.gameScreen}>
          <Text style={styles.title}>OceanFlip</Text>
          <Text style={styles.score}>Pares encontrados: {score}</Text>
          <Text style={styles.timer}>Tiempo restante: {timeLeft}s</Text>
          <View style={styles.board}>
            {board.map((card, index) => {
              const isTurnedOver =
                selectedCards.includes(index) || matchedCards.includes(index);
              return (
                <Card
                  key={index}
                  isTurnedOver={isTurnedOver}
                  onPress={() => handleTapCard(index)}
                >
                  {card}
                </Card>
              );
            })}
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.modalView}>
              {didPlayerWin() ? (
                <Text style={styles.modalText}>Felicidades, haz encontrado todos los pares en {25 - timeLeft} segundos!</Text>
              ) : (
                <Text style={styles.modalText}>Haz encontrado {score} pares. Puedes hacerlo mejor!</Text>
              )}
              <View style={styles.buttonRow}>
                <Button title="Reiniciar juego" onPress={handleRestart} />
                <Button title="Ir al inicio" onPress={handleGoToStart} />
              </View>
            </View>
          </Modal>
        </View>
      )}
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
  },
  gameScreen: {
    alignItems: "center",
    justifyContent: "center",
  },
  board: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "snow",
    marginVertical: 15,
  },
  score: {
    fontSize: 20,
    color: "snow",
    marginBottom: 10,
  },
  timer: {
    fontSize: 20,
    color: "snow",
    marginBottom: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: 'absolute',
    top: '50%',
    left: '46%',
    transform: [{ translateX: -150 }, { translateY: -150 }],
    width: 300,
    height: 160,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  }
});


function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }
  return array;
}
