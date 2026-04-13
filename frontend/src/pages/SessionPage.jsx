import { useUser } from '@clerk/clerk-react'
import { useNavigate, useParams } from 'react-router'
import { useEndSession, useJoinSession, useSessionById } from '../hooks/useSession'
import { PROBLEMS } from '../data/problems'
import { useEffect, useState } from 'react'
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from "react-resizable-panels";
import { Loader2Icon, LogOutIcon, LucideClipboardMinus, PhoneOffIcon } from 'lucide-react'
import { getDifficultyBadgeClass } from '../lib/util'
import {useStreamClient}  from '../hooks/useStreamClient'
import { StreamCall, StreamVideo } from '@stream-io/video-react-sdk'
import Navbar from '../components/Navbar'
import VideoCallUI from '../components/VideoCallUi'
import CodeEditorPanel from '../components/CodeEditor'
import OutputPanel from '../components/OutputPanel'


const SessionPage = () => {
    const navigate =useNavigate()
    const {id}= useParams()
    const {user}= useUser()
    const [isRunning, setIsRunning] = useState(false)
    const {data:sessionData, isLoading:sessionLoading, refetch}= useSessionById(id)
    const joinSessionMutation = useJoinSession()
    const endSessionMutation = useEndSession()

    const session=sessionData?.session
    const isHost= session?.host?.clerkId === user.id
    const isParticipant= session?.participant?.clerkId === user.id

    const {streamClient,
    call,
    chatClient,
    channel,
    isInitaializedCall}=useStreamClient(
      session, sessionLoading, isHost, isParticipant
    )

    const problemData= session?.problem ? Object.values(PROBLEMS).find((p)=> p.title === session.problem) : null
    const [selectedLanguage, setSelectedLanguage] = useState("python")
    const [code, setCode] = useState("")
    const [output, setOutput] = useState(problemData?.starterCode?.[selectedLanguage]|| null)

    useEffect(()=>{
        if(!session || !user || sessionLoading) return
        if(isHost || isParticipant) return

        joinSessionMutation.mutate(id,{onSuccess:refetch})
    },[session,user,sessionLoading,isHost,isParticipant,id])

    useEffect(()=>{
        if(!session|| sessionLoading) return
        if(session.status==="completed"){
            navigate("/dashboard")
            return
        }
        // Removed duplicate joinSessionMutation.mutate() — already handled in the effect above
        if(problemData){
            setCode(problemData.starterCode[selectedLanguage])
            setOutput(null)
        }
    },[session,sessionLoading,isHost,isParticipant,id,problemData,selectedLanguage])

    useEffect(()=>{
        if(problemData?.starterCode?.[selectedLanguage]){
            setCode(problemData?.starterCode?.[selectedLanguage])
        }
    },[problemData,selectedLanguage])

    const handleLanguageChange=(e)=>{
        const lang=e.target.value
        setSelectedLanguage(lang)
        setCode(problemData?.starterCode?.[lang]|| "")
        setOutput(null)
    }

    const handleRunCode=()=>{
        setIsRunning(true)
        setOutput(null)

        setTimeout(()=>{
            setIsRunning(false)
            setOutput("Code executed successfully")
        },2000)
    }

    const handleEndSession =()=>{
        if(confirm("Are you sure you want to end the session?")){
            endSessionMutation.mutate(id)
            navigate("/dashboard")
        }
    }

  return (
        <div className="h-screen bg-base-100 flex flex-col">
      <Navbar />

      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal">
          {/* LEFT PANEL - CODE EDITOR & PROBLEM DETAILS */}
          <Panel defaultSize={50} minSize={30}>
            <PanelGroup direction="vertical">
              {/* PROBLEM DSC PANEL */}
              <Panel defaultSize={50} minSize={20}>
                <div className="h-full overflow-y-auto bg-base-200">
                  {/* HEADER SECTION */}
                  <div className="px-6 py-5 bg-base-100 border-b border-base-300 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h1 className="text-2xl font-bold text-base-content truncate">
                          {session?.problem || "Loading..."}
                        </h1>
                        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                          {problemData?.category && (
                            <span className="text-xs font-medium text-base-content/50 bg-base-200 px-2 py-0.5 rounded-full">{problemData.category}</span>
                          )}
                          <span className="text-xs text-base-content/50">
                            👤 {session?.host?.name || "Loading..."} &nbsp;·&nbsp; {session?.participant ? 2 : 1}/2 participants
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`badge badge-md font-semibold ${getDifficultyBadgeClass(session?.difficulty)}`}>
                          {session?.difficulty
                            ? session.difficulty.slice(0, 1).toUpperCase() + session.difficulty.slice(1)
                            : "Easy"}
                        </span>
                        {isHost && session?.status === "active" && (
                          <button
                            onClick={handleEndSession}
                            disabled={endSessionMutation.isPending}
                            className="btn btn-error btn-sm gap-1.5"
                          >
                            {endSessionMutation.isPending ? (
                              <Loader2Icon className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <LogOutIcon className="w-3.5 h-3.5" />
                            )}
                            End
                          </button>
                        )}
                        {session?.status === "completed" && (
                          <span className="badge badge-ghost badge-md">Completed</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    {/* problem desc */}
                    {problemData?.description && (
                      <div className="bg-base-100 rounded-xl border border-base-300">
                        <div className="flex items-center gap-2 px-5 py-3 border-b border-base-300">
                          <span className="text-lg">📋</span>
                          <h2 className="text-sm font-bold uppercase tracking-widest text-base-content/70">Description</h2>
                        </div>
                        <div className="p-5 space-y-2 text-sm leading-relaxed">
                          <p className="text-base-content/85">{problemData.description.text}</p>
                          {problemData.description.notes?.map((note, idx) => (
                            <p key={idx} className="text-base-content/70 pl-3 border-l-2 border-primary/40">
                              {note}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* examples section */}
                    {problemData?.examples && problemData.examples.length > 0 && (
                      <div className="bg-base-100 rounded-xl border border-base-300">
                        <div className="flex items-center gap-2 px-5 py-3 border-b border-base-300">
                          <span className="text-lg">🧪</span>
                          <h2 className="text-sm font-bold uppercase tracking-widest text-base-content/70">Examples</h2>
                        </div>
                        <div className="p-5 space-y-3">
                          {problemData.examples.map((example, idx) => (
                            <div key={idx} className="rounded-lg overflow-hidden border border-base-300">
                              <div className="flex items-center gap-2 px-3 py-1.5 bg-base-200 border-b border-base-300">
                                <span className="badge badge-xs badge-primary">#{idx + 1}</span>
                                <p className="text-xs font-semibold text-base-content/70">Example {idx + 1}</p>
                              </div>
                              <div className="bg-base-200/50 p-3 font-mono text-xs space-y-1.5">
                                <div className="flex gap-2">
                                  <span className="text-primary font-bold min-w-[60px]">Input:</span>
                                  <span className="text-base-content/85">{example.input}</span>
                                </div>
                                <div className="flex gap-2">
                                  <span className="text-secondary font-bold min-w-[60px]">Output:</span>
                                  <span className="text-base-content/85">{example.output}</span>
                                </div>
                                {example.explanation && (
                                  <div className="pt-2 border-t border-base-300 mt-1">
                                    <span className="text-base-content/55 font-sans">
                                      <span className="font-semibold">Explanation: </span>
                                      {example.explanation}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Constraints */}
                    {problemData?.constraints && problemData.constraints.length > 0 && (
                      <div className="bg-base-100 rounded-xl border border-base-300">
                        <div className="flex items-center gap-2 px-5 py-3 border-b border-base-300">
                          <span className="text-lg">⚡</span>
                          <h2 className="text-sm font-bold uppercase tracking-widest text-base-content/70">Constraints</h2>
                        </div>
                        <ul className="p-5 space-y-1.5">
                          {problemData.constraints.map((constraint, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-primary mt-0.5 text-xs">▸</span>
                              <code className="text-xs text-base-content/80 font-mono">{constraint}</code>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </Panel>

              <PanelResizeHandle className="h-1.5 bg-base-300 hover:bg-primary/60 transition-colors cursor-row-resize flex items-center justify-center group">
                <div className="w-8 h-0.5 rounded-full bg-base-content/20 group-hover:bg-primary/80 transition-colors" />
              </PanelResizeHandle>

              <Panel defaultSize={50} minSize={20}>
                <PanelGroup direction="vertical">
                  <Panel defaultSize={70} minSize={30}>
                    <CodeEditorPanel
                      selectedLanguage={selectedLanguage}
                      code={code}
                      isRunning={isRunning}
                      onLanguageChange={handleLanguageChange}
                      onCodeChange={(value) => setCode(value)}
                      onRunCode={handleRunCode}
                    />
                  </Panel>

                  <PanelResizeHandle className="h-1.5 bg-base-300 hover:bg-primary/60 transition-colors cursor-row-resize flex items-center justify-center group">
                    <div className="w-8 h-0.5 rounded-full bg-base-content/20 group-hover:bg-primary/80 transition-colors" />
                  </PanelResizeHandle>

                  <Panel defaultSize={30} minSize={15}>
                    <OutputPanel output={output} />
                  </Panel>
                </PanelGroup>
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle className="w-1.5 bg-base-300 hover:bg-primary/60 transition-colors cursor-col-resize flex items-center justify-center group">
            <div className="h-8 w-0.5 rounded-full bg-base-content/20 group-hover:bg-primary/80 transition-colors" />
          </PanelResizeHandle>

          {/* RIGHT PANEL - VIDEO CALLS & CHAT */}
          <Panel defaultSize={50} minSize={30}>
            <div className='h-full bg-base-200 p-4 overflow-auto'>
              {isInitaializedCall ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2Icon className="w-8 h-8 animate-spin" />
                </div>
              ) : !streamClient || !call?(
                <div className="h-full flex items-center justify-center">
                  <div className="card bg-base-100 shadow-xl max-w-md">
                    <div className="card-body items-center text-center">
                      <div className="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center mb-4">
                        <PhoneOffIcon className="w-12 h-12 text-error" />
                      </div>
                      <h2 className="card-title text-2xl">Connection Failed</h2>
                      <p className="text-base-content/70">Unable to connect to the video call</p>
                    </div>
                  </div>
                </div>
              ):(
                <StreamVideo client={streamClient}>
                  <StreamCall call={call}>
                    <VideoCallUI
                      chatClient={chatClient}
                      channel={channel}
                    />
                  </StreamCall>
                </StreamVideo>
              )}

            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default SessionPage
