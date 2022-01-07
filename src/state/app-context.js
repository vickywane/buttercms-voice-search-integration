import React, { createContext, useReducer } from 'react'
import { ResultReason, SpeechConfig, AudioConfig, SpeechRecognizer } from 'microsoft-cognitiveservices-speech-sdk'

const ButterCMS = require('buttercms')(process.env.REACT_APP_BUTTERCMS_TOKEN)

export const initialRecordState = {
    connectionError: null,
    searchText: '',

    blogPosts: null,

    voiceSearchResult: null,
    recorderBits: [],
    recorderInstance: null,
    recorderStatus: "STOPPED",
    recorderError: null,
    recorderMediaStream: null,
    convertedAudioResult: null,

    recognizerInstance: null,

    fetchBlogPosts: () => { },
    startRecorder: () => { },
    stopRecorder: () => { },
    dispatch: () => { },
    performTextSearch: () => { }
};

const AppContext = createContext(initialRecordState);
export default AppContext;

const reducer = (state, action) => {
    const { payload } = action

    switch (action.type) {
        case "LOADING_STATE":

            return {
                ...state,
                [payload.loaderType]: payload.loadStatus
            }

        case "RECORD_ERROR":
            return {
                ...state,
                connectionError: payload.errorType,
                recorderStatus: "STOPPED",
                recorderMediaStream: null,
                recorderInstance: null,
                recorderBits: []
            }

        case "COMPLETE_AUDIO_CONVERSION":
            return {
                ...state,
                convertedAudioResult: payload.textData
            }

        case "SET_BLOG_POSTS":
            return {
                ...state,
                blogPosts: payload.data
            }

        case "START_RECORDING":
            return {
                ...state,
                recorderStatus: payload.recorderStatus,
            };

        case "RECORD_CONVERSION_RESULT":
            return {
                ...state,
                recorderStatus: payload.recorderStatus,
            }
        default:
            return state;
    }
};

export const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialRecordState);

    const handleLoaderState = (loadStatus, dispatch) => {
        dispatch({
            type: "LOADING_STATE",
            payload: {
                loaderType: 'recorderStatus',
                loadStatus
            }
        })
    }

    const fetchBlogPosts = async () => {
        try {
            const { data } = await ButterCMS.post.list({
                "page": 1,
                "page_size": 10,
            })

            dispatch({
                type: "SET_BLOG_POSTS",
                payload: {
                    data: data.data
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    const performTextSearch = async (searchText) => {
        try {
            const { data } = await ButterCMS.post.search(searchText, {
                "page": 1,
                "page_size": 10
            })

            console.log("SEARCH DATA:", data);

            dispatch({
                type: "SET_BLOG_POSTS",
                payload: {
                    data: data.data
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    const startRecorder = async () => {
        const SPEECH_KEY = process.env.REACT_APP_SPEECH_SERVICE_KEY
        const SPEECH_REGION = process.env.REACT_APP_SPEECH_SERVICE_REGION

        try {
            handleLoaderState("RECORDING", dispatch)

            let speechConfig = SpeechConfig.fromSubscription(SPEECH_KEY, SPEECH_REGION);
            speechConfig.speechRecognitionLanguage = "en-US";
            const audioConfig = AudioConfig.fromDefaultMicrophoneInput();
            state.recognizerInstance = new SpeechRecognizer(speechConfig, audioConfig)

            handleLoaderState("GENERATING_VOICE_RESULT", dispatch)

            state.recognizerInstance.recognizeOnceAsync(result => {
                if (result.errorDetails) {
                    return dispatch({
                        type: "RECORD_ERROR", payload: {
                            connectionError: result.errorDetails,
                        }
                    });
                }

                dispatch({
                    type: "COMPLETE_AUDIO_CONVERSION", payload: {
                        textData: result.text
                    }
                });

                handleLoaderState("PERFORM_TEXT_SEARCH", dispatch)
                performTextSearch(result.text)
            });
        } catch (error) {
            console.log("RECORD ERROR", error)

            dispatch({
                type: "RECORD_ERROR", payload: {
                    connectionError: error,
                }
            });
        }
    };

    const stopRecorder = async () => {
        try {

            if (state.recognizerInstance) {
                state.recognizerInstance.close()
                state.recognizeInstance = null
            }

        } catch (e) {
            console.log("STOP RECORD ERROR", e)
        }
    };

    return (
        <AppContext.Provider
            value={{
                ...state,
                startRecorder,
                stopRecorder,
                dispatch,
                performTextSearch,
                fetchBlogPosts
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
