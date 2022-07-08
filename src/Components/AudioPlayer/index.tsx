import React, {useEffect, useState} from 'react';
import { Audio } from 'expo-av';
import { Recording, RecordingStatus, Sound } from 'expo-av/build/Audio';

import {  
  AudioContainer,
  AudioContainerRow,
  AudioTitleWrapper,
  AudioTitle,
  AudioSubtitle,
  AudioIcon,
  IconButton,
  AudioView,
  AudioPlayerView,
  AudioPlayerIcon,} from './styles'

import { ProgressBar } from '../ProgressBar';
import { Subtitle } from '../../Screens/NewProject/styles';
import { useTheme } from 'styled-components';
import { Alert } from 'react-native';


interface Props {
  audioMomentStart: string;
  audioUriStart?: string;
  setLoading: (loading: boolean) => void;
}

export function AudioPlayer({ audioMomentStart, audioUriStart, setLoading }: Props) {
  const theme = useTheme();

  const [sound, setSound] = useState<Sound>();
  const [soundStatus, setSoundStatus] = useState<Audio.RecordingStatus>();
  const [soundDuration, setSoundDuration] = useState(0);
  const [soundDurationFormatted, setSoundDurationFormatted] = useState<Audio.RecordingStatus>();
  const [soundUri, setSoundUri] = useState('');

  const [audioOnPlayingPosition, setAudioOnPlayingPosition] = useState(0);
  const [audioOnPlayingPositionFormatted, setAudioOnPlayingPositionFormatted] = useState(0);
  const [positionPaused, setPositioPaused] = useState(0);

  const [audioMoment, setAudioMoment] = useState('none');


  const [recording, setRecording] = useState<Recording>();
  const [recordingStatus, setRecordingStatus] = useState<RecordingStatus>();

  const source = {
    uri: audioUriStart
  }

  useEffect(() => {
    async function getAudio() {
      console.log(`@AudioRecorder:59 -> com audioMomentStart: ${audioMomentStart} e audioUriStart -> ${audioUriStart}`)
      const atualSound = await Audio.Sound.createAsync(
        {
          uri: audioUriStart
        }
        );
      setAudioMoment(audioMomentStart);
      setSound(atualSound.sound);
      setSoundStatus(atualSound.status);
      setSoundDuration(Number(atualSound.status.durationMillis))
      setSoundDurationFormatted(millisToMinutesAndSeconds(Number(atualSound.status.durationMillis)));
      setLoading(false);
    }

    if (audioMomentStart) {
      getAudio();
    }
  }, [])
  
  // async function startRecording() {
  //   try {
  //     console.log('Requesting permissions..');
  //     await Audio.requestPermissionsAsync();
  //     await Audio.setAudioModeAsync({
  //       allowsRecordingIOS: true,
  //       playsInSilentModeIOS: true,
  //     }); 
  //     console.log('Starting recording..');
  //     const { recording, status} = await Audio.Recording.createAsync(
  //        Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY
  //     );
  //     setRecordingStatus(status)
  //     setAudioMoment('recording');
  //     setAudioMomentResult('recording');
  //     setRecording(recording);

  //   } catch (err) {
  //     console.error('Failed to start recording', err);
  //   }
  // }

  // async function stopRecording() {
  //   console.log('Stopping recording..');
  //   setRecording(undefined);
  //   await recording.stopAndUnloadAsync();
  //   const uri = recording.getURI();
  //   setSoundUri(uri);
  //   setAudioUriResult(uri);
  //   const sound = (await recording.createNewLoadedSoundAsync());
  //   setSound(sound.sound);
  //   setSoundStatus(sound.status)
  //   setSoundDuration(Number(sound.status.durationMillis))
  //   setSoundDurationFormatted(millisToMinutesAndSeconds(Number(sound.status.durationMillis)));

    
  //   setAudioMoment('recorded');
  //   setAudioMomentResult('recorded');
  // }


  async function playSound() {
    console.log('Loading Sound');
    // const { sound } = await Audio.Sound.createAsync(
    //    require('./assets/Hello.mp3')
    // );
    if (!positionPaused || positionPaused === soundDuration) {
      await sound.setPositionAsync(0);
    } else {
      await sound.setPositionAsync(positionPaused)
    }
    console.log('Playing Sound');
    await sound.playAsync();
    setAudioMoment('playing');
    sound.setOnPlaybackStatusUpdate((status)=> {
      setAudioOnPlayingPosition(status.positionMillis);
      setAudioOnPlayingPositionFormatted(millisToMinutesAndSeconds(status.positionMillis));

      if (status.positionMillis === soundDuration) {
        setAudioMoment('played');
      }
    });
  }

  async function PauseSound() {
    console.log(`pausing Sound`);

    await sound.pauseAsync();
    setAudioMoment('paused');
    
    sound.setOnPlaybackStatusUpdate((status)=> {
      setPositioPaused(status.positionMillis);
    });

  }

  // async function handleTrashAudio() {
  //   await sound.unloadAsync();
  //   setSoundUri('');
  //   setAudioUriResult('');
  //   setAudioMoment('none');
  //   setAudioMomentResult('none');
  // }

  // function alertTrash() {
  //   Alert.alert(
  //     "Deseja excluir?",
  //     "Você tem certeza que deseja excluir esse áudio?",
  //     [
  //       {
  //         text: "Excluir",
  //         onPress: () => handleTrashAudio(),
  //         style: "destructive",
  //       },
  //       {
  //         text: "Cancelar",
  //         onPress: () => console.log(`Cancelar clicado`),
  //         style: "cancel",
  //       }
  //     ]
  //   )
  // }

  function millisToMinutesAndSeconds(millis): string {
    var minutes = Math.floor(millis / 60000);
    var seconds = Number(((millis % 60000) / 1000).toFixed(0));
    let secondsFormatted = '00';
    let minutesFormatted = '00';

    if(minutes < 10) {
      minutesFormatted = `0${minutes}`
    } else {
      minutesFormatted = `${minutes}`
    }

    if(seconds < 10) {
      secondsFormatted = `0${seconds}`
    } else {
      secondsFormatted = `${seconds}`
    }

    return `${minutesFormatted}:${secondsFormatted}`;
  }


  return (
    <AudioContainer>
     
      {audioMoment === "recorded" ? (
        <AudioPlayerView>
          <IconButton onPress={playSound}>
            <AudioPlayerIcon name='play' />
          </IconButton>
          <AudioSubtitle>00:00:00</AudioSubtitle>
          <ProgressBar
            progress={`0%`}
          />
          <AudioSubtitle>{soundDurationFormatted}</AudioSubtitle>
        </AudioPlayerView>
      ) : 
        audioMoment === "playing" ? (
        <AudioPlayerView>
          <IconButton onPress={PauseSound}>
            <AudioPlayerIcon name='pause' />
          </IconButton>
          <AudioSubtitle>{audioOnPlayingPositionFormatted}</AudioSubtitle>
          <ProgressBar
            progress={`${(audioOnPlayingPosition/soundDuration)*100}%`}
          />
          <AudioSubtitle>{soundDurationFormatted}</AudioSubtitle>
        </AudioPlayerView>
        ) : 
        audioMoment === "paused" ? (
        <AudioPlayerView>
          <IconButton onPress={playSound}>
            <AudioPlayerIcon name='play' />
          </IconButton>
          <AudioSubtitle>{audioOnPlayingPositionFormatted}</AudioSubtitle>
          <ProgressBar
            progress={`${(audioOnPlayingPosition/soundDuration)*100}%`}
          />
          <AudioSubtitle>{soundDurationFormatted}</AudioSubtitle>
        </AudioPlayerView>
        ) 
        :
        audioMoment === "played" ? (
          <AudioPlayerView>
            <IconButton onPress={playSound}>
              <AudioPlayerIcon name='play' />
            </IconButton>
            <AudioSubtitle>{audioOnPlayingPositionFormatted}</AudioSubtitle>
            <ProgressBar
              progress={`${(audioOnPlayingPosition/soundDuration)*100}%`}
            />
            <AudioSubtitle>{soundDurationFormatted}</AudioSubtitle>
          </AudioPlayerView>
          ) : null
      }
    </AudioContainer>
  );
};

