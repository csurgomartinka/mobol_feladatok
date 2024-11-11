import { useState,useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, View, Button, FlatList, TextInput, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Checkbox from 'expo-checkbox';

export default function App() {
  const [adatTomb,setAdatTomb]=useState([])
  const [szoveg,setSzoveg]=useState("")
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [datum,setDatum] = useState("");
  const [isChecked, setChecked] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = () => {
    setShow(true);
    setMode("date");
  };




  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('feladatok', jsonValue);
    } catch (e) {
      // saving error
    }
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('feladatok');
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      // error reading value
    }
  };

  useEffect(()=>{
    /*
      let szemely={
        "id":0,
        "nev":"Ani",
        "email":"nahajia@gmail.com"
      }
      storeData(szemely)
    */
   /*
    let tomb=[
      {
        "id":0,
        "feladat":"verseny Debrecen",
        "datum":"2024.11.8",
        "kesz":0
      },
      {
        "id":1,
        "feladat":"fogászat",
        "datum":"2024.11.12",
        "kesz":0
      },      
    ]
      storeData(tomb)
*/

      getData().then(adat=>{
        //alert(JSON.stringify(adat))
        setAdatTomb(adat)
      })
  },[])

  const felvitel=()=>{
      let uj=[...adatTomb]
      uj.push({
        "id":uj.length,
        "feladat":szoveg,
        "datum":datum,
        "kesz":0
      })

      uj.sort((a, b) => new Date(a.datum) - new Date(b.datum));
      setAdatTomb(uj)
      storeData(uj)
      alert("Sikeres felvitel!")
  }

  const torles=()=>{
    let uj=[]
    setAdatTomb(uj)
    storeData(uj)
    alert("Sikeres törlés!")
  }

  const valtozikDatum = (event,datum)=>{
    alert(datum)
    setShow(false)
    setDatum(datum.getFullYear() + "." + (datum.getMonth()+1) + "." + datum.getDate())
  }

  const befejezVagyVissza = (id)=>{
    alert(id)
    let uj = [...adatTomb]
    for (const elem of uj) {
      if(elem.id == id)
      {
        if(elem.kesz == 0) elem.kesz = 1
        else elem.kesz = 0
      }
    }
    setAdatTomb(uj)
    storeData(uj)
  }

  return (
    <View style={styles.container}>
      <Text style={{color:"blue",marginLeft:20}}>Feladat:</Text>
      <View
      style={{ flexDirection: 'row' }}>
      <View style={{flex: 8}}>
        <TextInput
            style={styles.input}
            onChangeText={setSzoveg}
            value={szoveg}
          />
      </View>
      <View style={{flex: 2}}>
        <TouchableOpacity onPress={()=>setSzoveg("")}>
          <Text style={{marginTop:20,backgroundColor:"brown",marginRight:60,textAlign:"center",color:"white"}}>x</Text>
        </TouchableOpacity>
      </View>
    </View>
      
      <View style={{backgroundColor:"blue",marginLeft:50,marginRight:50}}>
        <Button title='Dátum kiválasztása' onPress={showMode}/>
      </View>
      <Text style={{backgroundColor:"yellow",marginLeft:50,marginRight:50,marginTop:10,padding:10}}>{datum}</Text>
      <View style={{backgroundColor:"blue",margin:10,marginTop:20}}>
      <Button title='Új feladat felvitele' onPress={felvitel}/>
      </View>
      
      

      <View
      style={{ flexDirection: 'row' }}>
        <View style={{flex: 1}}>
          <Checkbox style={{margin:5,backgroundColor:"green",marginLeft:20}} value={isChecked} onValueChange={setChecked} />
        </View>
        <View style={{flex: 1,backgroundColor:"brown"}}>
          <Button title='Minden törlése' onPress={torles} />
        </View>
      </View>
      <FlatList
            data={adatTomb}
            renderItem={({item,index}) => 
              <View>
                {isChecked || !item.kesz ? 
                  <View style={styles.keret}>
                    <Text style={{color:"blue",fontStyle:"italic"}}>{item.datum}</Text>
                    <Text>{item.feladat}</Text>
                    
                    {item.kesz? 
                    <TouchableOpacity onPress={()=>befejezVagyVissza(item.id)}>
                      <Text>Visszaállít</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={()=>befejezVagyVissza(item.id)}>
                      <Text>Befejez</Text>
                    </TouchableOpacity>
                    }
                  
                </View>  
                :
                    null
                }
              
              </View>            
              }
              keyExtractor={(item, index) => index}
          />




      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          onChange={(event,datum)=>valtozikDatum(event,datum)}
        />
      )}


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop:60
  },
  keret:{
    margin:10,
    borderWidth:2,
    borderColor:"grey",
    padding:20,
    borderRadius:10
  },
  input: {
    width: "90%",
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderColor:"blue",
    borderRadius:10
  },
});