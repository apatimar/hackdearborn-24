import streamlit as st
from langchain.prompts import PromptTemplate
from langchain_openai import OpenAI
import random
import os
from dotenv import load_dotenv

# Load environment variables from .env.local
load_dotenv(dotenv_path='.env.local')

# Initialize LangChain LLM (make sure your API key is set correctly)
openai_api_key = os.getenv("OPENAI_API_KEY")
if openai_api_key is None:
    st.error("Please set your OpenAI API key in the environment variables.")
else:
    llm = OpenAI(openai_api_key=openai_api_key)

# Initialize session state
if 'difficulty' not in st.session_state:
    st.session_state.difficulty = 1  # Start at difficulty level 1
if 'score' not in st.session_state:
    st.session_state.score = 0
if 'question_count' not in st.session_state:
    st.session_state.question_count = 0
if 'current_question' not in st.session_state:
    st.session_state.current_question = None
if 'current_answer' not in st.session_state:
    st.session_state.current_answer = None
if 'quiz_active' not in st.session_state:
    st.session_state.quiz_active = False  # Track whether quiz is active
if 'selected_answer' not in st.session_state:
    st.session_state.selected_answer = None
if 'options' not in st.session_state:
    st.session_state.options = []
if 'selected_topic' not in st.session_state:
    st.session_state.selected_topic = None
if 'resources_active' not in st.session_state:
    st.session_state.resources_active = False  # Track whether resources are active

# Define a LangChain prompt template for questions
def generate_question(topic, difficulty):
    prompt_template = PromptTemplate(
        input_variables=["topic", "difficulty"],
        template="""
        Generate a financial literacy quiz question on the topic "{topic}" with a difficulty of {difficulty}/3.
        Provide the question, the correct answer, and 3 incorrect answers.
        """
    )
    prompt = prompt_template.format(topic=topic, difficulty=difficulty)
    
    response = llm(prompt)
    
    try:
        question, rest = response.split("Correct Answer:")
        correct_answer, incorrect_answers = rest.split("Incorrect Answers:")
        incorrect_options = incorrect_answers.split(",")
        options = [correct_answer.strip()] + [opt.strip() for opt in incorrect_options]
        random.shuffle(options)
        return question.strip(), correct_answer.strip(), options
    except ValueError:
        return response.strip(), "Unknown", []

# Function to evaluate the answer
def check_answer(user_answer, correct_answer):
    if user_answer == correct_answer:
        st.session_state.score += 1
    st.session_state.question_count += 1

# Display the question and accept user input
def display_question(topic):
    if st.session_state.question_count < 10:
        if st.session_state.current_question is None:
            question, correct_answer, options = generate_question(topic, st.session_state.difficulty)
            st.session_state.current_question = question
            st.session_state.current_answer = correct_answer
            st.session_state.options = options
            st.session_state.selected_answer = None

        st.write(f"Question {st.session_state.question_count + 1}: {st.session_state.current_question}")
        
        for option in st.session_state.options:
            if st.session_state.selected_answer is None:
                if st.button(option):
                    st.session_state.selected_answer = option
                    check_answer(option, st.session_state.current_answer)
                    st.experimental_rerun()
            else:
                if option == st.session_state.selected_answer:
                    if option == st.session_state.current_answer:
                        st.success(option)
                    else:
                        st.error(option)
                else:
                    if option == st.session_state.current_answer:
                        st.success(option)
                    else:
                        st.write(option)

    else:
        st.write(f"Quiz complete! Your score is {st.session_state.score}/10.")
        if st.button("Close Quiz"):
            st.session_state.quiz_active = False
            reset_quiz()

# Reset button to retake the quiz
def reset_quiz():
    st.session_state.difficulty = 1
    st.session_state.score = 0
    st.session_state.question_count = 0
    st.session_state.current_question = None
    st.session_state.current_answer = None
    st.session_state.selected_answer = None
    st.session_state.options = []
    st.experimental_rerun()

# Main dashboard UI for quiz
def dashboard_ui():
    st.title("Financial Literacy Dashboard")
    st.subheader("Choose a Topic to Begin")

    # Topic 1: Budgeting Basics
    st.write("")
    with st.expander("📊 Budgeting Basics", expanded=False):
        st.write("Learn about budgeting, managing income, and making smart financial choices.")
        if st.button("Take Quiz on Budgeting Basics"):
            st.session_state.quiz_active = True
            st.session_state.selected_topic = "Budgeting Basics"

    st.write("")
    # Topic 2: Saving and Investments
    with st.expander("💰 Saving and Investments", expanded=False):
        st.write("Explore savings strategies and the fundamentals of investing.")
        if st.button("Take Quiz on Saving and Investments"):
            st.session_state.quiz_active = True
            st.session_state.selected_topic = "Saving and Investments"

    st.write("")
    # Topic 3: Credit and Loans
    with st.expander("🏦 Credit and Loans", expanded=False):
        st.write("Understand how credit works and learn about loans and interest rates.")
        if st.button("Take Quiz on Credit and Loans"):
            st.session_state.quiz_active = True
            st.session_state.selected_topic = "Credit and Loans"

# Resources page
def resources_ui():
    st.title("Financial Literacy Resources")
    st.subheader("Choose a Topic to Explore Resources")

    # Topic 1: Budgeting Basics
    st.write("")
    with st.expander("📊 Budgeting Basics Resources", expanded=False):
        st.write("""
            - [Budgeting 101 Guide](https://www.example.com/budgeting-guide)
            - [How to Create a Budget](https://www.example.com/how-to-create-budget)
            - [Budgeting Tips for College Students](https://www.example.com/college-budget-tips)
        """)

    st.write("")
    # Topic 2: Saving and Investments
    with st.expander("💰 Saving and Investments Resources", expanded=False):
        st.write("""
            - [Beginner's Guide to Investing](https://www.example.com/investing-guide)
            - [Top Savings Strategies](https://www.example.com/savings-strategies)
            - [How to Start Saving for Retirement](https://www.example.com/saving-for-retirement)
        """)

    st.write("")
    # Topic 3: Credit and Loans
    with st.expander("🏦 Credit and Loans Resources", expanded=False):
        st.write("""
            - [Understanding Credit Scores](https://www.example.com/credit-scores)
            - [How to Manage Loans](https://www.example.com/manage-loans)
            - [The Importance of Good Credit](https://www.example.com/good-credit)
        """)

# Sidebar for navigation
with st.sidebar:
    page = st.radio("Navigate", ("Quiz", "Resources"))

if page == "Quiz":
    if not st.session_state.quiz_active:
        dashboard_ui()
    else:
        st.markdown(
            """
            <style>
            .popup-box {
                position: fixed;
                top: 10%;
                left: 10%;
                width: 80%;
                background-color: white;
                z-index: 9999;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                padding: 20px;
            }
            .overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 9998;
            }
            </style>
            <div class="overlay"></div>
            <div class="popup-box">
            """,
            unsafe_allow_html=True,
        )
        st.sidebar.success("Select a page above")
        st.subheader(f"Topic: {st.session_state.selected_topic}")
        display_question(st.session_state.selected_topic)
        st.markdown("</div>", unsafe_allow_html=True)
else:
    resources_ui()
