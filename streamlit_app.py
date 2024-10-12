import streamlit as st

# Initialize session state for streak and points
if 'streak' not in st.session_state:
    st.session_state.streak = 0
if 'points' not in st.session_state:
    st.session_state.points = 0
if 'quiz_status' not in st.session_state:
    st.session_state.quiz_status = {}

# Signup form for first and last name
st.title("💡 Financial Literacy App")

with st.form("signup_form"):
    first_name = st.text_input("First Name")
    last_name = st.text_input("Last Name")
    submitted = st.form_submit_button("Sign Up")

    if submitted:
        st.write(f"Welcome, {first_name} {last_name}!")

# Display streak and points collected
st.metric(label="🔥 Streak Count", value=st.session_state.streak)
st.metric(label="💰 Coins Collected", value=st.session_state.points)

# Topics and quizzes section
st.header("📚 Topics on Financial Literacy")

# List of topics
topics = {
    "Budgeting Basics": ["Quiz 1", "Quiz 2"],
    "Investing Fundamentals": ["Quiz 1", "Quiz 2", "Quiz 3"],
    "Credit & Loans": ["Quiz 1", "Quiz 2"]
}

def complete_quiz(topic, quiz):
    st.session_state.quiz_status[f"topic_quiz"] = "Complete"
    st.session_state.streak+=1
    st.session_state.points+=10

for topic, quizzes in topics.items():
    with st.expander(topic):
        for i, quiz in enumerate(quizzes):
            quiz_key = f"{topic}_{i}"
    
            if quiz_key not in st.session_state.quiz_status:
                st.session_state.quiz_status[quiz_key] = "Incomplete"

            st.write(f"{quiz}: {st.session_state.quiz_status[quiz_key]}")
            
            if st.button(f"Complete {quiz}", key=f"complete_{quiz_key}"):
                complete_quiz(topic, i)
                st.write(f"{quiz} marked as complete!")