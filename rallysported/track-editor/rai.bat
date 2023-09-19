@rsed_ld %1
@if not exist ~~~.--- goto oops
@copy /B /Y GAME.DTA ~~ME.DTA > NUL
@if not exist ~~ME.DTA goto oops
@rsed_ai
@~~llye.exe
@rsed_ai %1
@del ~~*.???
@IF ERRORLEVEL 1 GOTO oops
@cls
@echo The new CPU lap for '%1' was saved.
@goto done
:oops
@cls
@echo RallySportED encountered an error and had to bail.
@echo The lap was NOT saved.
:done
