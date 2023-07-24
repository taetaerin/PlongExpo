import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, KeyboardAvoidingView } from 'react-native';

const CommentInput = () => {
  const [comment, setComment] = useState('');

  const handleCommentChange = (text) => {
    setComment(text);
  };

  const handlePostComment = () => {
    // 댓글 전송 로직을 구현하면 됩니다.
    // 예: 댓글을 서버로 전송하거나 다른 처리를 수행합니다.
    console.log('Post Comment:', comment);
    // 댓글 입력창 초기화
    setComment('');
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
        <TouchableOpacity onPress={handlePostComment}>
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
