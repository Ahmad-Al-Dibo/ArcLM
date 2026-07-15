def test_modern_web_api_public_import():
    from arclm.web import DatasetRoot, WebConfig, create_app

    assert callable(create_app)
    assert WebConfig().host == "127.0.0.1"
    assert DatasetRoot(name="workspace", path=".").name == "workspace"


def test_root_import_does_not_export_modern_web_api():
    import arclm

    assert not hasattr(arclm, "create_app")
