import CustomPlayfieldCanvas from './components/CustomPlayfieldCanvas'
import HoldPieceCanvas from './components/HoldPieceCanvas'
import PieceQueueCanvas from './components/PieceQueueCanvas'
import TetrisCanvas from './components/TetrisCanvas'

function App() {
  // return (
  //   <div className="w-screen h-screen bg-cyan-500 flex items-center justify-center">
  //     <div className="w-full flex flex-row justify-center gap-4">
  //       <HoldPieceCanvas />
  //       <TetrisCanvas />
  //       <PieceQueueCanvas />
  //     </div>
  //   </div>
  // );

  return (
    <div className="w-screen h-screen bg-cyan-500 flex items-center justify-center">
      <div className="w-full flex flex-row justify-center gap-4">
        {/* <HoldPieceCanvas /> */}
        <CustomPlayfieldCanvas />
        {/* <PieceQueueCanvas /> */}
      </div>
    </div>
  )
}

export default App
