import { StyleSheet, View, Text, Pressable } from "react-native"

function GoalItem({itemData, OnDeleteItem}){
    return(
        <Pressable>
            <View style={StyleSheet.goalsItem}>
                <text style={StyleSheet.goalText}>{itemData.item} </text>
            </View>
        </Pressable>
    )
}

export default GoalItem

const styles= StyleSheet.create({
    goalsItem:{
        margin: 8,
        padding: 8,
        borderRadius: 6,
        backgroundColor: '"8576FF',
        color:'white'
    },
    goalText:{
        color:'white'
    }
})