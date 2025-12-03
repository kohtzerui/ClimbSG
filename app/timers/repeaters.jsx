// app/timers/repeaters.jsx or repeaters.js
import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

const WORK_SECONDS = 7;
const REST_SECONDS = 3;
const BIG_REST_SECONDS = 120;
const REPS_PER_SET = 6;
const TOTAL_SETS = 3;

export default function RepeatersScreen() {
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState("work"); // "work" | "rest" | "bigRest" | "done"
  const [currentSet, setCurrentSet] = useState(1);
  const [currentRep, setCurrentRep] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(WORK_SECONDS);

  useEffect(() => {
    if (!isRunning || phase === "done") return;

    const id = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(id);
  }, [isRunning, phase]);

  useEffect(() => {
    if (!isRunning) return;
    if (secondsLeft > 0) return;
    if (phase === "done") return;

    advancePhase();
  }, [secondsLeft, isRunning, phase]);

  const advancePhase = () => {
    setSecondsLeft(0);

    setPhase((prevPhase) => {
      if (prevPhase === "work") {
        if (currentRep < REPS_PER_SET) {
          setSecondsLeft(REST_SECONDS);
          return "rest";
        } else {
          if (currentSet < TOTAL_SETS) {
            setSecondsLeft(BIG_REST_SECONDS);
            return "bigRest";
          } else {
            setIsRunning(false);
            return "done";
          }
        }
      }

      if (prevPhase === "rest") {
        setCurrentRep((r) => r + 1);
        setSecondsLeft(WORK_SECONDS);
        return "work";
      }

      if (prevPhase === "bigRest") {
        setCurrentSet((s) => s + 1);
        setCurrentRep(1);
        setSecondsLeft(WORK_SECONDS);
        return "work";
      }

      return prevPhase;
    });
  };

  const handleStartPause = () => {
    if (phase === "done") {
      resetAll();
      setIsRunning(true);
      return;
    }
    setIsRunning((prev) => !prev);
  };

  const resetAll = () => {
    setIsRunning(false);
    setPhase("work");
    setCurrentSet(1);
    setCurrentRep(1);
    setSecondsLeft(WORK_SECONDS);
  };

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    const mm = m.toString().padStart(2, "0");
    const ss = s.toString().padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const phaseLabel =
    phase === "work"
      ? "WORK"
      : phase === "rest"
      ? "REST (between reps)"
      : phase === "bigRest"
      ? "BIG REST (between sets)"
      : "DONE";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Repeaters</Text>

      <Text style={styles.subTitle}>
        Set {currentSet}/{TOTAL_SETS} • Rep {Math.min(currentRep, REPS_PER_SET)}/
        {REPS_PER_SET}
      </Text>

      <Text style={styles.phase}>{phaseLabel}</Text>

      <Text style={styles.timer}>{formatTime(secondsLeft)}</Text>

      <View style={styles.buttonRow}>
        <Pressable style={styles.button} onPress={handleStartPause}>
          <Text style={styles.buttonText}>
            {isRunning ? "Pause" : phase === "done" ? "Restart" : "Start"}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.secondaryButton]}
          onPress={resetAll}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </Pressable>
      </View>

      <Text style={styles.note}>
        {WORK_SECONDS}s on / {REST_SECONDS}s off × {REPS_PER_SET} reps •{" "}
        {TOTAL_SETS} sets • {BIG_REST_SECONDS / 60} min between sets
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    alignItems: "center",
    backgroundColor: "#020617",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "white",
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 16,
    color: "#9ca3af",
    marginBottom: 4,
  },
  phase: {
    fontSize: 18,
    color: "#fbbf24",
    marginTop: 12,
    marginBottom: 24,
  },
  timer: {
    fontSize: 60,
    fontVariant: ["tabular-nums"],
    color: "white",
    marginVertical: 16,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: "#22c55e",
  },
  secondaryButton: {
    backgroundColor: "#6b7280",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  note: {
    marginTop: 24,
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
  },
});
