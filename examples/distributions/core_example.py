try:
    from arclm import get_distribution_info
except ImportError:
    def get_distribution_info():
        return {"edition": "full", "source_version": "canonical"}


info = get_distribution_info()
print(info["edition"])
