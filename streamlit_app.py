import streamlit as st

if 'streak' not in st.session_state:
    st.session_state.streak = 0
if 'points' not in st.session_state:
    st.session_state.points = 0
if 'quiz_status' not in st.session_state:
    st.session_state.quiz_status = {}

# Signup form for first and last name
st.title("💡 Financial Literacy App")

# with st.form("signup_form"):
#     first_name = st.text_input("First Name")
#     last_name = st.text_input("Last Name")
#     submitted = st.form_submit_button("Sign Up")

#     if submitted:
#         st.write(f"Welcome, {first_name} {last_name}!")

# streak and points collected
st.metric(label="🔥 Streak Count", value=st.session_state.streak)
st.metric(label="💰 Coins Collected", value=st.session_state.points)

# Topics and quizzes
st.header("📚 Topics on Financial Literacy")

# List of topics
topics = {
    "Budgeting Basics": {
        "Topic 1": ["[Readings and resources](https://example.com/readings1)", "Quiz 1"],
        "Topic 2": ["[Readings and resources](https://example.com/readings2)", "Quiz 2"]
    },
    "Investing Fundamentals": {
        "Topic 1": ["[Readings and resources](https://example.com/readings3)", "Quiz 1"],
        "Topic 2": ["[Readings and resources](https://example.com/readings4)", "Quiz 2", "Quiz 3"]
    },
    "Credit & Loans": {
        "Topic 1": ["[Readings and resources](https://example.com/readings5)", "Quiz 1"],
        "Topic 2": ["[Readings and resources](https://example.com/readings6)", "Quiz 2"]
    }
}

def complete_quiz(topic, quiz):
    st.session_state.quiz_status[f"topic_quiz"] = "Complete"
    st.session_state.streak+=1
    st.session_state.points+=10

for category, topic_data in topics.items():
    with st.expander(category):
        for topic, content in topic_data.items():
            st.subheader(topic)
            
            # Section for Readings
            st.write(content[0])
            
            # Section for Quizzes
            st.subheader("Quizzes")
            for quiz in content[1:]:
                quiz_id = f"{category}_{topic}_{quiz}"
                if quiz_id not in st.session_state.quiz_status:
                    st.session_state.quiz_status[quiz_id] = False
                
                # Display quiz completion status
                if st.session_state.quiz_status[quiz_id]:
                    st.write(f"{quiz} - Completed ✅")
                else:
                    if st.button(f"Complete {quiz}", key=quiz_id):
                        st.session_state.quiz_status[quiz_id] = True
                        st.success(f"You've completed {quiz}!")