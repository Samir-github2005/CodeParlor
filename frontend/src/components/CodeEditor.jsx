import Editor from '@monaco-editor/react'
import { Loader2Icon, PlaneIcon } from 'lucide-react'
import { LANGUAGE_CONFIG } from '../data/problems'

const CodeEditor = ({currentLang,code,isRunning,onLangChange,onCodeChange,onRunCode}) => {
  return (
    <div className='h-full bg-base-300 flex flex-col'>
      <div className='flex items-center justify-between p-4 border-b border-base-200'>
        <div className='flex items-center gap-2'>
          <img src={LANGUAGE_CONFIG[currentLang].icon} alt={LANGUAGE_CONFIG[currentLang].name} className='size-6'/>
          <select className='select select-sm' value={currentLang} onChange={onLangChange}>
            {
              Object.entries(LANGUAGE_CONFIG).map(([Key, lang])=>(
                <option key={Key} value={Key}>{lang.name}</option>
              ))
            }
          </select>
        </div>
        <button onClick={onRunCode} className='btn btn-sm btn-primary' disabled={isRunning}>
          {
            isRunning?(<><Loader2Icon className='size-4 animate-spin'/>Running ...</>):(<><PlaneIcon className='size-4'/>Run Code</>)
          }
        </button>
      </div>
      <div className='flex-1'>
        <Editor
        height={"100%"}
        value={code}
        onChange={onCodeChange}
        language={LANGUAGE_CONFIG[currentLang].monacoLang}
        theme='vs-dark'
        options={{
          minimap: {
            enabled: false
          },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          fontSize: 14,
          lineNumbers: "on"
        }}
        />
      </div>
    </div>
  )
}

export default CodeEditor