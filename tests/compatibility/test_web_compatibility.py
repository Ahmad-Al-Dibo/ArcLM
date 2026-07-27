def test_legacy_simple_interface_public_imports_still_work():
    import arclm
    from arclm.simple_interface import create_simple_interface_app, run_simple_interface

    assert callable(arclm.create_simple_interface_app)
    assert callable(arclm.run_simple_interface)
    assert callable(create_simple_interface_app)
    assert callable(run_simple_interface)
