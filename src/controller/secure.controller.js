export const adminFunction = (req, res) => {
    res.status(200).json({message:'Admin functionaly executed'})
}
export const superAdminFunction = (req, res) => {
    res.status(200).json({message:'Super admin functionaly executed'})
}

export const employeeFunction = (req, res) => {
    res.status(200).json({message:"Employee functionaly executed"})
}
