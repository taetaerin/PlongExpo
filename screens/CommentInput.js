import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { firestore } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import moment from 'moment';


const CommentInput = ({postId}) => {
  const [comment, setComment] = useState('');

  const auth = getAuth()
  const user = auth.currentUser; 

  const handleCommentChange = (text) => {
    setComment(text);
  };

  const handleAddComment = async () => {
    try {
      if (!comment.trim()) {
        return;
      }

      const currentTime = new Date();
  
      const dateTime = moment(currentTime).format('YYYY.MM.DD HH시 mm분');
      
      const commentsRef = collection(firestore, 'comments');

      // Create a new comment document in Firestore
      await addDoc(commentsRef, {
        postId: postId,
        text: comment,
        timestamp: dateTime,
        nickName: user.displayName,
        avatar: user.photoURL,
        uid: user.uid
      });

      // Clear the comment input after adding the comment
      setComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={10}
      style={styles.container}
    >
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={comment}
          onChangeText={handleCommentChange}
          multiline
        />
        <TouchableOpacity onPress={handleAddComment}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>전송</Text>
          </View>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    height: 60,
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    marginRight: 8,
    justifyContent:'center',
    alignItems:'center',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#0BE060',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    height: 40,
    alignItems:'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CommentInput;
