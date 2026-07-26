"""Use defensive Security Core tools from the Agent Runtime."""

from arclm.security.tools import create_security_tool_collection


collection = create_security_tool_collection()
redact = collection.tools[0]
hash_text = collection.tools[1]
print(redact.invoke({"text": "api_key=demo"}).value)
print(hash_text.invoke({"text": "ArcLM"}).value)
