from arclm.training import TrainingState


def test_training_state_is_serializable():
    state = TrainingState(epoch=1, global_step=5, optimizer_step=3, last_loss=1.25)

    restored = TrainingState.from_dict(state.to_dict())

    assert restored == state


def test_training_state_ignores_unknown_checkpoint_fields():
    restored = TrainingState.from_dict({"epoch": 2, "future": "ignored"})

    assert restored.epoch == 2
    assert not hasattr(restored, "future")
