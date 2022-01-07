import React, { createContext, useReducer } from 'react'
import axios from "axios";
import { MediaRecorder, register } from 'extendable-media-recorder';
import { connect } from 'extendable-media-recorder-wav-encoder';

export const initialRecordState = {
    connectionError: null,

    loadingTextSearch: false,
    textSearchResult: null,

    voiceSearchResult: null,
    recorderBits: [],
    recorderInstance: null,
    recorderStatus: "STOPPED",
    recorderError: null,
    recorderMediaStream: null,

    performTextSearch: () => { },
    startRecorder: () => { },
    stopRecorder: () => { },
    dispatch: () => { }
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
                recorderMediaStream : null,
                recorderInstance: null, 
                recorderBits: []
            }

        case "TEXT_SEARCH_RESULT":
            return {
                ...state,
                textSearchResult: payload.data
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

export const AGENT_URL = 'http://localhost:4040/api/agent/voice-input'

export const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialRecordState);

    const handleLoaderState = (loadingState, dispatch) => {
        dispatch({
            type: "LOADER",
            payload: {
                loading: loadingState,
                loaderType: 'loadingTextSearch'
            }
        })
    }

    const startRecorder = async () => {
        try {
            await register(await connect())

            state.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
            state.recorderInstance = new MediaRecorder(state.mediaStream, { mimeType: 'audio/wav' })

            state.recorderInstance.start()
            state.recorderInstance.ondataavailable = (event) => state.recorderBits.push(event.data)

            dispatch({
                type: "LOADING_STATE",
                payload: {
                    loaderType: 'recorderStatus',
                    loadStatus: "RECORDING"
                }
            });
        } catch (e) {
            console.log("RECORD ERROR", e)
        }
    };

    const submitAudioRecord = async (formData) => {
        try {
            dispatch({
                type: "LOADING_STATE", payload: {
                    loaderType: "recorderStatus",
                    loadStatus: "GENERATING_VOICE_RESULT"
                }
            });

            const req = await fetch(`http://localhost:4040/api/agent/voice-input`, {
                method: "POST",
                body: formData
            })

            const response = await req.json()
            console.log(response);

            dispatch({
                type: "LOADING_STATE", payload: {
                    loaderType: "recorderStatus",
                    loadStatus: "PERFORMING_TEXT_SEARCH"
                }
            });
        } catch (e) {
            dispatch({
                type: "RECORD_ERROR", payload: {
                    connectionError: e,
                }
            });
        } finally {
            state.recorderInstance = null
            state.mediaStream = null

            dispatch({
                type: "LOADING_STATE",
                payload: {
                    loaderType: "recorderStatus",
                    loadStatus: "STOPPED"
                }
            });
        }
    }

    const stopRecorder = async () => {
        try {
            state.recorderInstance.stop()
            state.mediaStream.getTracks().forEach(track => track.enabled && track.stop())

            state.recorderInstance.onstop = async () => {
                if (state.recorderInstance.state === "inactive") {
                    state.recorderStatus = "STOPPED"

                    const recordBlob = new Blob(state.recorderBits, {
                        type: "audio/mp3",
                    });

                    const inputFile = new File([recordBlob], "input", {
                        type: "audio/wav",
                    });

                    const formData = new FormData();
                    formData.append("voiceInput", inputFile);

                    await submitAudioRecord(formData)
                }
            };
        } catch (e) {
            console.log("STOP RECORD ERROR", e)
        }
    };

    const performTextSearch = async (searchStatement) => {
        handleLoaderState(true, dispatch)

        try {
            const { data } = await axios.post(`${AGENT_URL}/text-input`, {
                message: searchStatement
            })

            const { webhookStatus, queryResult } = data.data[0]

            // using webhookStatus code returned by Dialogflow for each webhook
            if (webhookStatus.code !== 0) {
                dispatch({
                    type: "CONNECTION_ERROR",
                    payload: {
                        errorType: "WEBHOOK_FAILED"
                    }
                })

                return
            }

            const { results } = JSON.parse(queryResult.fulfillmentMessages[0].text.text)

            dispatch({
                type: "TEXT_SEARCH_RESULT",
                payload: {
                    data: results
                }
            })
        } catch (e) {
            console.log(e);
        } finally {
            handleLoaderState(false, dispatch)
        }
    }

    return (
        <AppContext.Provider
            value={{
                ...state,
                startRecorder,
                stopRecorder,
                dispatch,
                performTextSearch
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
