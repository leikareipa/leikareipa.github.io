@rsed_ld %1
@if not exist ~~~.--- goto oops
@copy /B /Y %1\HITABLE.TXT ~~TABLE.TXT > NUL
@if not exist ~~TABLE.TXT goto oops
:alku
@~~likko
@copy /B /Y ~~TABLE.TXT %1\HITABLE.TXT > NUL
@if not exist exit.prg goto loppu
@~~llye
@goto alku
:loppu
@del ~~*.???
@cls
@echo Thanks for playing...
@goto done
:oops
:done
