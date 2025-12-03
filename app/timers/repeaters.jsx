import React, { useEffect, useMemo, useState } from 'react'
import {View,Text,TouchableOpacity, StyleSheet} from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { Link } from 'expo-router'

const WORKOUT_CONFIG = {
  SETS: 3, // number of sets
  REPS_PER_SET: 6, // hangs per set

  HANG_SEC: 7, // hang time (seconds)
  REST_BETWEEN_REPS_SEC: 3, // short rest between hangs
  REST_BETWEEN_SETS_SEC: 120 // long rest between sets (2 min)
}

const PHASES = {
  IDLE: 'idle',
  HANG: 'hang',
  REST: 'rest',
  LONG_REST: 'longRest',
  DONE: 'done'
}

function RepeatersTimer() {
  const [phase, setPhase] = useState(PHASES.HANG)
  const [setIndex, setSetIndex] = useState(1)
  const [repIndex, setRepIndex] = useState(1)
  const [secondsLeft, setSecondsLeft] = useState(WORKOUT_CONFIG.HANG_SEC)
  const [running, setRunning] = useState(false)

  const phaseLabel = useMemo(() => {
    switch (phase) {
      case PHASES.HANG:
        return 'HANG'
      case PHASES.REST:
        return 'REST'
      case PHASES.LONG_REST:
        return 'SET REST'
      case PHASES.DONE:
        return 'DONE'
      default:
        return 'READY'
    }
  }, [phase])

  // Tick down the timer
  useEffect(() => {
    if (!running || phase === PHASES.IDLE || phase === PHASES.DONE) return

    const intervalId = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev > 1) return prev - 1

        // when timer hits 0, move to next phase
        handlePhaseEnd()
        return prev
      })
    }, 1000)

    return () => clearInterval(intervalId)
  }, [running, phase, setIndex, repIndex])

  const handlePhaseEnd = () => {
    if (phase === PHASES.HANG) {
      const isLastRepInSet = repIndex >= WORKOUT_CONFIG.REPS_PER_SET
      const isLastSet = setIndex >= WORKOUT_CONFIG.SETS

      if (isLastRepInSet) {
        if (isLastSet) {
          setPhase(PHASES.DONE)
          setSecondsLeft(0)
        } else {
          setPhase(PHASES.LONG_REST)
          setSecondsLeft(WORKOUT_CONFIG.REST_BETWEEN_SETS_SEC)
        }
      } else {
        setPhase(PHASES.REST)
        setSecondsLeft(WORKOUT_CONFIG.REST_BETWEEN_REPS_SEC)
      }
      return
    }

    if (phase === PHASES.REST) {
      // back to hang, next rep
      setPhase(PHASES.HANG)
      setSecondsLeft(WORKOUT_CONFIG.HANG_SEC)
      setRepIndex(r => r + 1)
      return
    }

    if (phase === PHASES.LONG_REST) {
      // new set, rep 1
      setPhase(PHASES.HANG)
      setSecondsLeft(WORKOUT_CONFIG.HANG_SEC)
      setSetIndex(s => s + 1)
      setRepIndex(1)
      return
    }
  }

  const toggleRunning = () => {
    if (phase === PHASES.DONE) {
      resetWorkout(true)
      return
    }
    setRunning(prev => !prev)
  }

  const resetWorkout = (autoStart = false) => {
    setPhase(PHASES.HANG)
    setSecondsLeft(WORKOUT_CONFIG.HANG_SEC)
    setSetIndex(1)
    setRepIndex(1)
    setRunning(autoStart)
  }

  const formatTime = sec => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    if (m <= 0) return `${s}s`
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Repeaters</Text>

        <View style={styles.card}>
          <Text style={styles.phase}>{phaseLabel}</Text>
          <Text style={styles.time}>{formatTime(secondsLeft)}</Text>

          {phase !== PHASES.DONE && (
            <Text style={styles.sub}>
              Set {setIndex} / {WORKOUT_CONFIG.SETS} · Rep {repIndex} /{' '}
              {WORKOUT_CONFIG.REPS_PER_SET}
            </Text>
          )}

          {phase === PHASES.DONE && (
            <Text style={styles.sub}>Session complete 💪</Text>
          )}
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.primaryBtn} onPress={toggleRunning}>
            <Text style={styles.btnText}>
              {phase === PHASES.DONE ? 'Restart' : running ? 'Pause' : 'Start'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => resetWorkout(false)}
          >
            <Text style={styles.btnText}>Reset</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.note}>
          Edit WORKOUT_CONFIG at the top to match your repeater timings
          (sets, reps, hang, short rest, long rest).
        </Text>
      </View>
    </SafeAreaView>
  )
}

export default function RepeatersScreen() {
  return (
    <SafeAreaProvider>
      <RepeatersTimer />
      <Link href="/" style={styles.link}>
        Home Page
      </Link>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#050509' },
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginBottom: 24
  },
  card: {
    backgroundColor: '#14141A',
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 24
  },
  phase: {
    fontSize: 18,
    fontWeight: '600',
    color: '#c4c4d0',
    marginBottom: 8,
    letterSpacing: 1.5
  },
  time: {
    fontSize: 64,
    fontWeight: '800',
    color: 'white'
  },
  sub: {
    marginTop: 10,
    fontSize: 15,
    color: '#a0a0b5'
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12
  },
  primaryBtn: {
    backgroundColor: '#2D6BFF',
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 16
  },
  secondaryBtn: {
    backgroundColor: '#25252f',
    paddingHorizontal: 26,
    paddingVertical: 14,
    borderRadius: 16
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  note: {
    marginTop: 18,
    textAlign: 'center',
    fontSize: 13,
    color: '#8b8b98'
  },
  link: {
    fontSize: 20,
    color: 'white',
    padding: 12,
    textAlign: 'center',
    backgroundColor: '#14141A'
  }
})
