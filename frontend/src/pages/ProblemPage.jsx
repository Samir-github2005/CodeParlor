import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { PROBLEMS } from '../data/problems'
import { Panel, Group, Separator } from 'react-resizable-panels'
import PanelDescription from '../components/PanelDescription'
import OutputPanel from '../components/OutputPanel'
import CodeEditor from '../components/CodeEditor'
import Navbar from '../components/Navbar'
import { executeCode } from '../lib/piston'
import {toast} from 'react-hot-toast'
import confetti from 'canvas-confetti'

const ProblemPage = () => {
    const {id}= useParams()
    const navigate= useNavigate()
    const [currentProblemId, setCurrentProblemId] = useState("two-sum")
    const [currentLang, setCurrentLang] = useState("javascript")
    const [code, setCode] = useState(PROBLEMS[currentProblemId].starterCode.javascript)
    const [output, setOutput] = useState("")
    const [isRunning, setIsRunning] = useState(false)

    const currentProblem=PROBLEMS[currentProblemId]
    useEffect(()=>{
        if(id && PROBLEMS[id]){
            setCurrentProblemId(id)
            setCode(PROBLEMS[id].starterCode[currentLang])
        }
    },[id,currentLang])

    const handleLangChange=(lang)=>{
        const newLang= lang.target.value
        setCurrentLang(newLang)
        setCode(currentProblem.starterCode[newLang])
        setOutput(null)
    }
    const handleProblemChange=(newProblemId)=>{
        navigate(`/problem/${newProblemId}`)
    }
    const triggerConfetti=()=>{
        confetti({
            particleCount80,
            spread:250,
            origin:{ x:0.2, y:0.6}
        }),

        confetti({
            particleCount:100,
            spread:200,
            origin:{ x:0.8, y:0.6}
        })
    }

    const normalizeOutput=(output)=>{
        if(typeof output !== "string") return ""
        return output.trim().replace(/\r\n/g, "\n")
    }
    const checkIfTestPassed=(actualOutput, expectedOutput)=>{
        const normalizeActual= normalizeOutput(actualOutput)
        const normalizeExpected= normalizeOutput(expectedOutput)
        return normalizeActual === normalizeExpected
    }
    const handleRunCode=async()=>{
        setIsRunning(true)
        setOutput(null)

        const res=await executeCode(currentLang,code)
        setOutput(res)
        setIsRunning(false)

        //check if code executed successfully
        if(res.success){
            //check if all test cases passed
            const expectedOutput= currentProblem.expectedOutput[currentLang]
            const testPassed= checkIfTestPassed(res.output, expectedOutput)

            if(testPassed){
                triggerConfetti()
                toast.success("All cases passed")
            }else{
                toast.error("test cases failed")
            }
        }else{
            toast.error("code execution failed")
        }
    }

  return (
    <div className="h-screen bg-base-100 flex flex-col">
      <Navbar />

      <div className="flex-1">
        <Group orientation="horizontal">
            {/* left panel for description */}
            <Panel defaultSize={40} minSize={30}>
                <PanelDescription problem={currentProblem} currentProblemId={currentProblemId} onProblemChange={handleProblemChange} allProblem={Object.values(PROBLEMS)} />
            </Panel>

            <Separator className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize"/>

            {/* right panel for code editor & output */}
            <Panel defaultSize={46} minSize={30}>
                <Group orientation="vertical">
                    {/* code editor panel */}
                    <Panel defaultSize={70} minSize={30}>
                        <CodeEditor currentLang={currentLang} code={code} isRunning={isRunning} onLangChange={handleLangChange} onCodeChange={setCode} onRunCode={handleRunCode} />
                    </Panel>

                    <Separator className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize"/>

                    {/* output panel */}
                    <Panel defaultSize={30} minSize={30}>
                        <OutputPanel output={output}/>
                    </Panel>
                </Group>
            </Panel>

        </Group>
      </div>
    </div>
  )
}

export default ProblemPage