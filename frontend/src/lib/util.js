export const getDifficultyBadgeClass=(difficulty)=>{
    switch(difficulty?.toLowerCase()){
        case "easy":
            return "bg-green-500/20 text-green-500 border-green-500/30"
        case "medium":
            return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
        case "hard":
            return "bg-red-500/20 text-red-500 border-red-500/30"
        default:
            return "bg-gray-500/20 text-gray-500 border-gray-500/30"
    }
}