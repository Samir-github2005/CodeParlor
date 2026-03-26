import Editor from '@monaco-editor/react'
import { Loader2Icon, PlaneIcon } from 'lucide-react'
import { LANGUAGE_CONFIG } from '../data/problems'

const CodeEditor = ({selectedLanguage,code,isRunning,onLanguageChange,onCodeChange,onRunCode}) => {
  return (
    <div className='h-full bg-[#1e1e1e] flex flex-col'>
      <div className='flex items-center justify-between px-4 py-2.5 bg-[#252526] border-b border-[#3c3c3c]'>
        <div className='flex items-center gap-2.5'>
          <img src={LANGUAGE_CONFIG[selectedLanguage]?.icon} alt={LANGUAGE_CONFIG[selectedLanguage]?.name} className='size-5 rounded'/>
          <select className='select select-xs bg-[#3c3c3c] border-[#555] text-white hover:border-primary transition-colors' value={selectedLanguage} onChange={onLanguageChange}>
            {
              Object.entries(LANGUAGE_CONFIG).map(([Key, lang])=>(
                <option key={Key} value={Key}>{lang.name}</option>
              ))
            }
          </select>
        </div>
        <button onClick={onRunCode} className='btn btn-xs btn-primary gap-1.5 px-3' disabled={isRunning}>
          {
            isRunning?(<><Loader2Icon className='size-3 animate-spin'/>Running ...</>):(<><PlaneIcon className='size-3'/>Run Code</>)
          }
        </button>
      </div>
      <div className='flex-1'>
        <Editor
        height={"100%"}
        value={code}
        onChange={onCodeChange}
        language={LANGUAGE_CONFIG[selectedLanguage]?.monacoLang}
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