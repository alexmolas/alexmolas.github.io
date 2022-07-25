TODO=$(grep '✗' _tabs/100-list.md | wc -l)
DONE=$(grep '✓' _tabs/100-list.md | wc -l)
VAR=$(echo "scale=2; 100*$DONE/($TODO + $DONE)" | bc)
echo "Elements todo: ${TODO}"
echo "Elements done: ${DONE}"
echo "Frac of elements done: ${VAR} %"
