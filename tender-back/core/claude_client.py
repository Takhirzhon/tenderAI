import os
import anthropic
import streamlit as st

def get_claude_client():
    api_key = os.getenv("CLAUDE_API_KEY")
    if not api_key:
        st.error("❌ Ключ API Claude не знайдено у файлі .env")
        return None
    return anthropic.Anthropic(api_key=api_key)